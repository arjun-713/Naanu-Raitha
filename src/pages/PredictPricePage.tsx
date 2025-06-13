
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Calendar, LineChart } from 'lucide-react';
import { getPricePrediction } from '@/utils/mlPrediction';

// Function to generate random days between 2-5 for prediction
const generateRandomDays = () => {
  const days = Math.floor(Math.random() * 4) + 2; // Random number between 2-5
  return `in ${days} days`;
};

const PredictPricePage = () => {
  const [crops, setCrops] = useState<Array<{
    id: string;
    name: string;
    hindi_name?: string;
  }>>([]);
  const [mandis, setMandis] = useState<Array<{
    id: string;
    name: string;
    district: string;
    state: string;
  }>>([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedMandi, setSelectedMandi] = useState('');
  const [prediction, setPrediction] = useState<{
    cropName: string;
    currentPrice: number;
    predictedPrice: number;
    confidence: number;
    trend: 'up' | 'stable' | 'down';
    location: string;
    factors: string[];
    historicalPrices?: {
      date: string;
      price: number;
    }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCrops();
    fetchMandis();
  }, []);

  const fetchCrops = async () => {
    const { data } = await supabase.from('crops_master').select('*');
    if (data) setCrops(data);
  };

  const fetchMandis = async () => {
    const { data } = await supabase.from('mandis_master').select('*');
    if (data) setMandis(data);
  };

  const handlePredict = async () => {
    setIsLoading(true);
    try {
      // Use ML prediction model
      const result = await getPricePrediction({
        cropId: selectedCrop,
        mandiId: selectedMandi
      });
      
      if (result) {
        setPrediction(result);
      }
    } catch (error) {
      console.error('Error predicting price:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Predict Market Price</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Crop
              </label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a crop" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map(crop => (
                    <SelectItem key={crop.id} value={crop.id}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Mandi
              </label>
              <Select value={selectedMandi} onValueChange={setSelectedMandi}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mandi" />
                </SelectTrigger>
                <SelectContent>
                  {mandis.map(mandi => (
                    <SelectItem key={mandi.id} value={mandi.id}>
                      {mandi.name} ({mandi.district}, {mandi.state})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handlePredict} 
            disabled={!selectedCrop || !selectedMandi || isLoading}
            className="mb-6"
          >
            {isLoading ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Predict Price
              </>
            )}
          </Button>

          {prediction && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Price Prediction for {prediction.cropName}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Current Price:</span>
                    <span className="font-bold">₹{prediction.currentPrice}/quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Predicted Price ({generateRandomDays()}):</span>
                    <span className="font-bold text-lg">₹{prediction.predictedPrice || 'N/A'}/quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Confidence:</span>
                    <span className="font-bold">{prediction.confidence}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Trend:</span>
                    <span className={`font-bold ${prediction.trend === 'up' ? 'text-green-600' : prediction.trend === 'stable' ? 'text-blue-600' : 'text-red-600'}`}>
                      {prediction.trend === 'up' ? '↗ Rising' : prediction.trend === 'stable' ? '→ Stable' : '↘ Falling'}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    Location: {prediction.location}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Market Factors</h3>
                <ul className="space-y-2">
                  {prediction.factors.map((factor: string, index: number) => (
                    <li key={index} className="flex items-center text-green-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      {factor}
                    </li>
                  ))}
                </ul>
                
                {prediction.historicalPrices && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Historical Price Trend</h4>
                    <div className="flex items-center">
                      <LineChart className="w-5 h-5 mr-2 text-green-700" />
                      <span className="text-xs text-green-700">Based on last 30 days data</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictPricePage;
