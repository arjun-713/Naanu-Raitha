
import Header from '../components/Header';
import WeatherWidget from '../components/WeatherWidget';
import QuickActions from '../components/QuickActions';
import CropWatchlist from '../components/CropWatchlist';
import HarvestSummary from '../components/HarvestSummary';
import MarketNews from '../components/MarketNews';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Watchlist and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <CropWatchlist />
          </div>
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
        </div>

        {/* Weather Widget */}
        <div className="mb-8">
          <WeatherWidget />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            <HarvestSummary />
          </div>
          
          {/* Right Column */}
          <div className="xl:col-span-1">
            <MarketNews />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
