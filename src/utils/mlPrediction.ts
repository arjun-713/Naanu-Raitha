import { supabase } from '@/integrations/supabase/client';

interface PredictionInput {
  cropId: string;
  mandiId: string;
  date?: string; // Optional future date for prediction
}

interface PredictionResult {
  cropName: string;
  mandiName: string;
  location: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
  historicalPrices?: { date: string; price: number }[];
  forecastPrices?: { date: string; price: number }[];
}

// Cache for predictions to avoid excessive API calls
const predictionCache: Record<string, { result: PredictionResult, timestamp: number }> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Get price prediction using ML model for a specific crop and mandi
 * @param input Prediction input parameters
 * @returns Prediction result or null if error
 */
export const getPricePrediction = async (input: PredictionInput): Promise<PredictionResult | null> => {
  try {
    const cacheKey = `${input.cropId}-${input.mandiId}-${input.date || 'default'}`;
    const currentTime = Date.now();
    
    // Return from cache if valid
    if (predictionCache[cacheKey] && 
        currentTime - predictionCache[cacheKey].timestamp < CACHE_DURATION) {
      return predictionCache[cacheKey].result;
    }
    
    // Get crop and mandi details from Supabase
    const { data: crop } = await supabase
      .from('crops_master')
      .select('id, name')
      .eq('id', input.cropId)
      .single();
      
    const { data: mandi } = await supabase
      .from('mandis_master')
      .select('id, name, district, state')
      .eq('id', input.mandiId)
      .single();
    
    if (!crop || !mandi) {
      throw new Error('Crop or mandi not found');
    }
    
    // In a real implementation, you would call an ML model API here
    // For now, we'll simulate ML prediction with realistic data
    const result = await simulateMLPrediction(crop, mandi, input.date);
    
    // Cache the result
    predictionCache[cacheKey] = {
      result,
      timestamp: currentTime
    };
    
    return result;
    
  } catch (error) {
    console.error('Error getting price prediction:', error);
    return null;
  }
};

/**
 * Simulate ML prediction with realistic data patterns
 * In a real implementation, this would be replaced with an actual ML API call
 */
async function simulateMLPrediction(
  crop: { id: string; name: string }, 
  mandi: { id: string; name: string; district: string; state: string }, 
  targetDate?: string
): Promise<PredictionResult> {
  // Get base price for the crop
  const basePrice = getBasePriceForCrop(crop.name);
  
  // Generate seasonal factor (-10% to +20% based on month)
  const now = new Date();
  const month = targetDate ? new Date(targetDate).getMonth() : now.getMonth();
  const seasonalFactor = getSeasonalFactor(crop.name, month);
  
  // Generate mandi-specific factor (-5% to +5%)
  const mandiFactor = (parseInt(mandi.id) % 10) / 100;
  
  // Generate market trend factor (-8% to +8%)
  const trendSeed = parseInt(crop.id) % 100;
  const marketTrendFactor = ((trendSeed - 50) / 625); // Range approximately -0.08 to 0.08
  
  // Calculate prediction with all factors but ensure it's within ±200 of base price
  const totalFactor = 1 + seasonalFactor + mandiFactor + marketTrendFactor;
  let rawPredictedPrice = Math.round(basePrice * totalFactor);
  
  // Ensure the predicted price is within ±200 of the current price
  const maxDifference = 200;
  if (Math.abs(rawPredictedPrice - basePrice) > maxDifference) {
    // If outside the range, adjust to be within ±200
    const direction = rawPredictedPrice > basePrice ? 1 : -1;
    rawPredictedPrice = basePrice + (direction * (Math.random() * maxDifference));
  }
  
  // Round to nearest whole number
  const predictedPrice = Math.round(rawPredictedPrice);
  
  // Determine trend
  let trend: 'up' | 'down' | 'stable';
  const priceDiff = predictedPrice - basePrice;
  if (priceDiff > basePrice * 0.02) trend = 'up';
  else if (priceDiff < -basePrice * 0.02) trend = 'down';
  else trend = 'stable';
  
  // Generate random confidence percentage between 60% and 95%
  const confidence = Math.floor(Math.random() * 36) + 60;
  
  // Generate relevant factors based on the prediction
  const factors = generateFactors(trend, crop.name, month);
  
  // Generate historical price data (last 30 days)
  const historicalPrices = generateHistoricalPrices(basePrice, 30);
  
  // Generate forecast price data (next 15 days)
  const forecastPrices = generateForecastPrices(basePrice, predictedPrice, 15);
  
  return {
    cropName: crop.name,
    mandiName: mandi.name,
    location: `${mandi.district}, ${mandi.state}`,
    currentPrice: basePrice,
    predictedPrice,
    confidence,
    trend,
    factors,
    historicalPrices,
    forecastPrices
  };
}

/**
 * Get realistic base price for a crop
 */
function getBasePriceForCrop(cropName: string): number {
  // These prices are approximations based on typical Indian market prices
  const cropPrices: Record<string, number> = {
    'Rice': 2000,
    'Wheat': 2200,
    'Maize': 1800,
    'Jowar': 2500,
    'Bajra': 2300,
    'Ragi': 3000,
    'Barley': 2100,
    'Cotton': 6500,
    'Jute': 4200,
    'Sugarcane': 350,
    'Tobacco': 4500,
    'Groundnut': 5500,
    'Mustard': 4800,
    'Soybean': 3800,
    'Sunflower': 5200,
    'Sesame': 9000,
    'Linseed': 6000,
    'Castor': 5800,
    'Safflower': 5000,
    'Niger': 7000,
    'Gram': 4600,
    'Tur': 6000,
    'Moong': 7200,
    'Urad': 6800,
    'Lentil': 5500,
    'Peas': 4000,
    'Potato': 1200,
    'Onion': 1500,
    'Tomato': 2000,
    'Brinjal': 1800,
    'Cabbage': 1000,
    'Cauliflower': 1200,
    'Okra': 2500,
    'Pumpkin': 800,
    'Cucumber': 1500,
    'Watermelon': 1800,
    'Muskmelon': 2000,
    'Mango': 4500,
    'Banana': 2500,
    'Guava': 3000,
    'Papaya': 2200,
    'Grapes': 6000,
    'Apple': 8000,
    'Orange': 4000,
    'Lemon': 3500,
    'Pomegranate': 7000,
    'Coconut': 2500,
    'Cashew': 9000,
    'Arecanut': 35000,
    'Cardamom': 100000,
    'Pepper': 35000,
    'Chilli': 8000,
    'Turmeric': 7000,
    'Ginger': 6000,
    'Garlic': 4000,
    'Coriander': 7000,
    'Cumin': 21000,
    'Fennel': 12000,
    'Fenugreek': 8000,
  };
  
  // Return the price for the crop, or a random price in a reasonable range if not found
  return cropPrices[cropName] || Math.floor(Math.random() * 4000) + 1000;
}

/**
 * Get seasonal factor for a crop based on month
 * Different crops have different seasonal patterns
 */
function getSeasonalFactor(cropName: string, month: number): number {
  // Simplified seasonal patterns for different crop categories
  const cropCategories: Record<string, string> = {
    'Rice': 'kharif',
    'Wheat': 'rabi',
    'Maize': 'kharif',
    'Jowar': 'kharif',
    'Bajra': 'kharif',
    'Ragi': 'kharif',
    'Barley': 'rabi',
    'Cotton': 'kharif',
    'Jute': 'kharif',
    'Sugarcane': 'annual',
    'Groundnut': 'kharif',
    'Mustard': 'rabi',
    'Soybean': 'kharif',
    'Sunflower': 'rabi',
    'Potato': 'rabi',
    'Onion': 'rabi',
    'Tomato': 'annual',
    'Mango': 'summer',
    'Banana': 'annual',
    'Apple': 'summer',
    'Orange': 'winter',
  };
  
  const category = cropCategories[cropName] || 
    (Math.random() > 0.5 ? 'kharif' : 'rabi');
  
  // Seasonal factors based on crop category and month
  switch (category) {
    case 'kharif': // Sown in monsoon (Jun-Jul), harvested in autumn (Oct-Nov)
      if (month >= 9 && month <= 11) return -0.08; // Harvest season (lower prices)
      if (month >= 3 && month <= 5) return 0.15; // Scarcity (higher prices)
      return 0.05; // Normal season
      
    case 'rabi': // Sown in winter (Oct-Nov), harvested in spring (Mar-Apr)
      if (month >= 2 && month <= 4) return -0.08; // Harvest season (lower prices)
      if (month >= 8 && month <= 10) return 0.15; // Scarcity (higher prices)
      return 0.05; // Normal season
      
    case 'summer': // Summer fruits
      if (month >= 3 && month <= 6) return -0.05; // Harvest season (lower prices)
      if (month >= 9 && month <= 1) return 0.18; // Off season (higher prices)
      return 0.08; // Normal season
      
    case 'winter': // Winter fruits
      if (month >= 10 || month <= 1) return -0.05; // Harvest season (lower prices)
      if (month >= 4 && month <= 8) return 0.18; // Off season (higher prices)
      return 0.08; // Normal season
      
    case 'annual': // Year-round crops
    default:
      // Slight seasonal variation
      return ((month % 6) - 3) / 30; // Range approximately -0.1 to 0.1
  }
}

/**
 * Generate relevant factors based on trend and crop
 */
function generateFactors(trend: 'up' | 'down' | 'stable', cropName: string, month: number): string[] {
  const upFactors = [
    'Seasonal demand increase',
    'Weather conditions favorable for storage',
    'Lower supply in nearby mandis',
    'Government procurement active',
    'Export demand rising',
    'Reduced imports from competing countries',
    'Festival season approaching',
    'Increased industrial usage',
    'Transportation costs reduced',
    'Quality of produce improved'
  ];
  
  const downFactors = [
    'Oversupply in market',
    'Reduced export demand',
    'Weather conditions affecting quality',
    'Higher transportation costs',
    'Imports increased',
    'Government released buffer stocks',
    'Reduced consumer demand',
    'Competing crops available',
    'Post-harvest losses increased',
    'International market prices falling'
  ];
  
  const stableFactors = [
    'Supply and demand well balanced',
    'Consistent government policies',
    'Steady export-import scenario',
    'Weather conditions as expected',
    'No major changes in production costs',
    'Consumer demand stable',
    'International prices stable',
    'No significant quality variations',
    'Transportation and logistics stable',
    'No major policy changes'
  ];
  
  // Select factors based on trend
  const factorPool = trend === 'up' ? upFactors : 
                    trend === 'down' ? downFactors : 
                    stableFactors;
  
  // Shuffle and pick 2-4 factors
  const shuffled = [...factorPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
}

/**
 * Generate historical price data
 */
function generateHistoricalPrices(currentPrice: number, days: number): { date: string; price: number }[] {
  const result = [];
  const now = new Date();
  let price = currentPrice;
  
  // Generate prices with realistic day-to-day variations
  // but trending toward the current price
  for (let i = days; i > 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some randomness but ensure we trend toward current price
    const randomFactor = (Math.random() - 0.5) * 0.02; // -1% to +1%
    const trendFactor = (i / days) * 0.15 * (Math.random() > 0.5 ? 1 : -1); // Up to 15% trend
    
    price = Math.round(price / (1 + randomFactor + trendFactor));
    
    result.push({
      date: date.toISOString().split('T')[0],
      price
    });
  }
  
  // Ensure the last price is close to current price
  result.push({
    date: now.toISOString().split('T')[0],
    price: currentPrice
  });
  
  return result;
}

/**
 * Generate forecast price data
 */
function generateForecastPrices(currentPrice: number, predictedPrice: number, days: number): { date: string; price: number }[] {
  const result = [];
  const now = new Date();
  
  // Calculate daily change to reach predicted price
  const totalChange = predictedPrice - currentPrice;
  const dailyChange = totalChange / days;
  
  // Generate forecast with some randomness but trending toward predicted price
  let price = currentPrice;
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Add randomness but maintain overall trend
    const randomFactor = (Math.random() - 0.5) * 0.02; // -1% to +1%
    price = Math.round(price + dailyChange + (price * randomFactor));
    
    result.push({
      date: date.toISOString().split('T')[0],
      price
    });
  }
  
  return result;
}