
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceWidgetProps {
  cropName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  chartData: number[];
}

const PriceWidget = ({ cropName, currentPrice, change, changePercent, unit, chartData }: PriceWidgetProps) => {
  const isPositive = change >= 0;
  
  // Generate mini SVG chart
  const generatePath = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');
    
    return `M ${points.replace(/,/g, ' L ').substring(2)}`;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 min-w-[160px] flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 truncate">{cropName}</h4>
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="text-lg font-bold text-gray-900">₹{currentPrice}</div>
        <div className="text-xs text-gray-500">{unit}</div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}₹{change} ({isPositive ? '+' : ''}{changePercent.toFixed(1)}%)
        </div>
        
        <svg width="60" height="20" className="overflow-visible">
          <path
            d={generatePath(chartData)}
            fill="none"
            stroke={isPositive ? '#16a34a' : '#dc2626'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default PriceWidget;
