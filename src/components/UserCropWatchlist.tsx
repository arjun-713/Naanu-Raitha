
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoreVertical } from 'lucide-react';
import PriceWidget from './PriceWidget';

const UserCropWatchlist = () => {
  const [userCrops, setUserCrops] = useState<any[]>([]);
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

      if (data) {
        // Mock price data for user crops
        const cropsWithPrices = data.map(crop => ({
          cropName: crop.crops_master.name,
          currentPrice: Math.floor(Math.random() * 5000) + 1000,
          change: Math.floor(Math.random() * 200) - 100,
          changePercent: (Math.random() * 20) - 10,
          unit: 'per quintal',
          chartData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000) + 2000)
        }));
        setUserCrops(cropsWithPrices);
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
      
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {userCrops.map((crop, index) => (
          <PriceWidget key={index} {...crop} />
        ))}
        {userCrops.length === 0 && (
          <div className="text-gray-500 text-center w-full py-8">
            No crops in your watchlist. Add some crops in your profile!
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCropWatchlist;
