
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Calendar, MapPin } from 'lucide-react';

const HistoryPage = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll create mock data since we don't have actual sold crops yet
      const mockHistory = [
        {
          id: 1,
          crop_name: 'Wheat',
          acres: 2.5,
          planting_date: '2023-11-15',
          harvest_date: '2024-04-15',
          total_investment: 45000,
          selling_price: 65000,
          profit: 20000,
          mandi_name: 'APMC Vashi',
          created_at: '2024-04-16'
        },
        {
          id: 2,
          crop_name: 'Cotton',
          acres: 3.0,
          planting_date: '2023-10-20',
          harvest_date: '2024-03-20',
          total_investment: 75000,
          selling_price: 95000,
          profit: 20000,
          mandi_name: 'Bellary APMC',
          created_at: '2024-03-21'
        }
      ];

      setHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Crop History</h1>
          <p className="text-gray-600">Track your past crops and profits</p>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No crop history yet</p>
            <p className="text-sm text-gray-400">Your sold crops will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((crop) => (
              <div key={crop.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{crop.crop_name}</h3>
                    <p className="text-sm text-gray-500">Sold on {new Date(crop.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${crop.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {crop.profit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-medium">
                        ₹{Math.abs(crop.profit).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {crop.profit >= 0 ? 'Profit' : 'Loss'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-medium">{crop.acres} acres</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Investment</p>
                    <p className="font-medium">₹{crop.total_investment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Selling Price</p>
                    <p className="font-medium">₹{crop.selling_price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">
                      {Math.floor((new Date(crop.harvest_date).getTime() - new Date(crop.planting_date).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span>Planted: {new Date(crop.planting_date).toLocaleDateString('en-IN')}</span>
                    <span>Harvested: {new Date(crop.harvest_date).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{crop.mandi_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
