
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoreVertical } from 'lucide-react';
import PriceWidget from './PriceWidget';
import { fetchCropPrices } from '@/utils/cropPriceData';

const UserCropWatchlist = () => {
  const [userCrops, setUserCrops] = useState<{
    cropId: string;
    cropName: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    unit: string;
    chartData: Array<number>;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserCrops();
  }, []);

  const fetchUserCrops = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_crops')
        .select(`
          *,
          crops_master (
            id,
            name,
            hindi_name
          )
        `)
        .eq('user_id', user.id);

      if (data && data.length > 0) {
        // Get crop IDs for price fetching
        const cropIds = data.map(crop => crop.crops_master.id);
        
        // Fetch real price data from API
        const cropPrices = await fetchCropPrices(cropIds);
        
        // Match crop prices with user crops
        const cropsWithPrices = cropPrices.map(price => ({
          cropId: price.cropId,
          cropName: price.cropName,
          currentPrice: price.currentPrice,
          change: price.change,
          changePercent: price.changePercent,
          unit: price.unit,
          chartData: price.chartData
        }));
        
        setUserCrops(cropsWithPrices);
      } else {
        setUserCrops([]);
      }
    } catch (error) {
      console.error('Error fetching user crops:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Your Crops Watchlist</h2>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      {userCrops.length === 0 ? (
        <div className="text-gray-500 text-center w-full py-8 bg-gray-50 rounded-lg border border-gray-200">
          No crops in your watchlist. Add some crops in your profile!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {userCrops.map((crop, index) => (
            <PriceWidget key={index} {...crop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCropWatchlist;
