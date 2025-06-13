import { supabase } from '@/integrations/supabase/client';

interface CropPrice {
  cropId: string;
  cropName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  chartData: number[];
}

// Cache for crop prices to avoid excessive API calls
const priceCache: Record<string, CropPrice> = {};
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Function to fetch crop prices from API
export const fetchCropPrices = async (cropIds: string[]): Promise<CropPrice[]> => {
  const currentTime = Date.now();
  
  // If cache is still valid and we have all requested crops, return from cache
  if (currentTime - lastFetchTime < CACHE_DURATION && 
      cropIds.every(id => id in priceCache)) {
    return cropIds.map(id => priceCache[id]);
  }
  
  try {
    // Get crop details from Supabase
    const { data: crops } = await supabase
      .from('crops_master')
      .select('id, name')
      .in('id', cropIds);
    
    if (!crops || crops.length === 0) {
      throw new Error('No crops found');
    }
    
    // In a real implementation, you would fetch from an actual price API
    // For now, we'll use the data from API data.csv
    
    // Simulate API call with realistic price data
    const cropPrices = crops.map(crop => {
      // Base price ranges for different crop types (from API data.csv)
      const basePrice = getBasePriceForCrop(crop.name);
      
      // Generate realistic price change (typically -5% to +5%)
      const changePercent = (Math.random() * 10) - 5;
      const change = (basePrice * changePercent) / 100;
      
      // Generate realistic 7-day price history with some trend consistency
      const trendFactor = Math.random() > 0.5 ? 1 : -1;
      const volatility = basePrice * 0.03; // 3% volatility
      
      const chartData = [];
      let lastPrice = basePrice - (change * 1.5); // Start from a point before current price
      
      for (let i = 0; i < 7; i++) {
        // Add some randomness but maintain the overall trend
        const dailyChange = (trendFactor * (Math.random() * volatility)) - (volatility / 2);
        lastPrice += dailyChange;
        chartData.push(Math.round(lastPrice));
      }
      
      // Ensure the last price matches the current price
      chartData[6] = basePrice;
      
      const priceData: CropPrice = {
        cropId: crop.id,
        cropName: crop.name,
        currentPrice: basePrice,
        change: Math.round(change),
        changePercent: parseFloat(changePercent.toFixed(1)),
        unit: 'per quintal',
        chartData
      };
      
      // Update cache
      priceCache[crop.id] = priceData;
      
      return priceData;
    });
    
    lastFetchTime = currentTime;
    return cropPrices;
    
  } catch (error) {
    console.error('Error fetching crop prices:', error);
    return [];
  }
};

// Helper function to get realistic base prices for different crops from API data.csv
function getBasePriceForCrop(cropName: string): number {
  // These prices are based on the Modal_Price from API data.csv
  const cropPrices: Record<string, number> = {
    'Rice': 4700,
    'Wheat': 2715,
    'Maize': 2166,
    'Jowar': 3928,
    'Bajra': 2300,
    'Ragi': 3000,
    'Barley': 2100,
    'Cotton': 6850,
    'Jute': 4200,
    'Sugarcane': 350,
    'Tobacco': 9250,
    'Groundnut': 5030,
    'Mustard': 4800,
    'Soybean': 3765,
    'Sunflower': 5200,
    'Sesame': 10000,
    'Linseed': 6000,
    'Castor': 5960,
    'Safflower': 5000,
    'Niger': 7000,
    'Gram': 4600,
    'Arhar': 6221,
    'Moong': 7200,
    'Black Gram': 6100,
    'Lentil': 5500,
    'Peas': 4000,
    'Potato': 1600,
    'Onion': 2400,
    'Tomato': 600,
    'Brinjal': 1650,
    'Cabbage': 1150,
    'Cauliflower': 1200,
    'Bitter gourd': 2200,
    'Pumpkin': 800,
    'Cucumber': 1200,
    'Watermelon': 1800,
    'Muskmelon': 2000,
    'Mango': 3200,
    'Banana': 9000,
    'Guava': 3000,
    'Papaya': 2200,
    'Grapes': 6000,
    'Apple': 10000,
    'Orange': 4000,
    'Lemon': 3600,
    'Pomegranate': 7000,
    'Coconut': 2500,
    'Cashew': 9000,
    'Arecanut': 35000,
    'Cardamom': 100000,
    'Pepper': 35000,
    'Dry Chillies': 10000,
    'Turmeric': 10550,
    'Ginger': 6000,
    'Garlic': 4000,
    'Coriander': 7000,
    'Cummin Seed': 20850,
    'Fennel': 12000,
    'Fenugreek': 8000,
  };
  
  // Return the price for the crop, or a random price in a reasonable range if not found
  return cropPrices[cropName] || Math.floor(Math.random() * 4000) + 1000;
}

// Function to get price prediction for a specific crop and mandi
export const getPricePrediction = async (cropId: string, mandiId: string) => {
  try {
    // Get crop and mandi details
    const { data: crop } = await supabase
      .from('crops_master')
      .select('name')
      .eq('id', cropId)
      .single();
      
    const { data: mandi } = await supabase
      .from('mandis_master')
      .select('name, district, state')
      .eq('id', mandiId)
      .single();
    
    if (!crop || !mandi) {
      throw new Error('Crop or mandi not found');
    }
    
    // In a real implementation, you would call an ML model API here
    // For now, we'll simulate ML prediction with realistic data
    
    // Get current price as baseline
    const basePrice = getBasePriceForCrop(crop.name);
    
    // Generate prediction (typically -10% to +15% from current price)
    const predictionFactor = (Math.random() * 25) - 10;
    const predictedPrice = Math.round(basePrice * (1 + (predictionFactor / 100)));
    
    // Generate confidence score (typically 75-95%)
    const confidence = Math.floor(Math.random() * 20) + 75;
    
    // Determine trend
    const trend = predictedPrice > basePrice ? 'up' : 'down';
    
    // Generate relevant factors based on trend
    const factors = trend === 'up' 
      ? [
          'Seasonal demand increase',
          'Weather conditions favorable',
          'Lower supply in nearby mandis',
          'Government procurement active'
        ].slice(0, Math.floor(Math.random() * 2) + 2)
      : [
          'Oversupply in market',
          'Reduced export demand',
          'Weather conditions affecting quality',
          'Higher transportation costs'
        ].slice(0, Math.floor(Math.random() * 2) + 2);
    
    return {
      cropName: crop.name,
      mandiName: mandi.name,
      location: `${mandi.district}, ${mandi.state}`,
      currentPrice: basePrice,
      predictedPrice,
      confidence,
      trend,
      factors
    };
    
  } catch (error) {
    console.error('Error getting price prediction:', error);
    return null;
  }
};