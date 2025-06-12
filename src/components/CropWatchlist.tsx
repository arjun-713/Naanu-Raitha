
import { MoreVertical } from 'lucide-react';
import PriceWidget from './PriceWidget';

const CropWatchlist = () => {
  const watchlistData = [
    {
      cropName: 'Wheat',
      currentPrice: 2850,
      change: 45,
      changePercent: 1.6,
      unit: 'per quintal',
      chartData: [2800, 2820, 2805, 2835, 2850, 2845, 2850]
    },
    {
      cropName: 'Rice',
      currentPrice: 3200,
      change: -25,
      changePercent: -0.8,
      unit: 'per quintal',
      chartData: [3250, 3235, 3220, 3210, 3205, 3190, 3200]
    },
    {
      cropName: 'Cotton',
      currentPrice: 6800,
      change: 120,
      changePercent: 1.8,
      unit: 'per quintal',
      chartData: [6650, 6680, 6720, 6750, 6780, 6795, 6800]
    },
    {
      cropName: 'Tomato',
      currentPrice: 45,
      change: 8,
      changePercent: 21.6,
      unit: 'per kg',
      chartData: [35, 38, 42, 39, 41, 43, 45]
    },
    {
      cropName: 'Onion',
      currentPrice: 28,
      change: -3,
      changePercent: -9.7,
      unit: 'per kg',
      chartData: [32, 31, 30, 29, 28, 29, 28]
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Your Watchlist</h2>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {watchlistData.map((crop, index) => (
          <PriceWidget key={index} {...crop} />
        ))}
      </div>
    </div>
  );
};

export default CropWatchlist;
