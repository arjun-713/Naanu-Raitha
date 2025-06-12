
import { Clock, ExternalLink } from 'lucide-react';

const MarketNews = () => {
  const newsItems = [
    {
      title: 'Wheat prices surge 15% due to export demand',
      summary: 'Strong international demand pushes wheat prices to 6-month high',
      time: '2 hours ago',
      category: 'Wheat'
    },
    {
      title: 'Monsoon forecast revised upward',
      summary: 'IMD predicts 102% normal rainfall this season',
      time: '4 hours ago',
      category: 'Weather'
    },
    {
      title: 'Cotton farmers benefit from new MSP announcement',
      summary: 'Government increases minimum support price by ₹500 per quintal',
      time: '6 hours ago',
      category: 'Policy'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Wheat': return 'bg-yellow-100 text-yellow-800';
      case 'Weather': return 'bg-blue-100 text-blue-800';
      case 'Policy': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Market News</h2>
        <button className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {newsItems.map((news, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                {news.category}
              </span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
            
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{news.title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{news.summary}</p>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{news.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketNews;
