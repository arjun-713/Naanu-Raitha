
import { Sprout, TrendingUp, Calendar } from 'lucide-react';

const HarvestSummary = () => {
  const harvestData = [
    {
      cropName: 'Wheat',
      plantedDate: '2024-11-15',
      status: 'Growing',
      expectedHarvest: '2024-04-15',
      investment: 25000,
      currentValue: 32000
    },
    {
      cropName: 'Cotton',
      plantedDate: '2024-10-20',
      status: 'Ready to Harvest',
      expectedHarvest: '2024-03-20',
      investment: 45000,
      currentValue: 58000
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Active Harvests</h2>
        <button className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {harvestData.map((harvest, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{harvest.cropName}</h3>
                  <p className="text-sm text-gray-500">{harvest.status}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    +₹{(harvest.currentValue - harvest.investment).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  +{(((harvest.currentValue - harvest.investment) / harvest.investment) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Invested</p>
                <p className="font-medium">₹{harvest.investment.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Current Value</p>
                <p className="font-medium">₹{harvest.currentValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Harvest Date</p>
                <p className="font-medium flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(harvest.expectedHarvest).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HarvestSummary;
