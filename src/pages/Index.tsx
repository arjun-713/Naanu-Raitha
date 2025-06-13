
import Header from '../components/Header';
import EnhancedWeatherWidget from '../components/EnhancedWeatherWidget';
import EnhancedQuickActions from '../components/EnhancedQuickActions';
import UserCropWatchlist from '../components/UserCropWatchlist';
import ActiveCrops from '../components/ActiveCrops';
import MarketNews from '../components/MarketNews';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Watchlist and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <UserCropWatchlist />
          </div>
          <div className="lg:col-span-2">
            <EnhancedQuickActions />
          </div>
        </div>

        {/* Weather Widget */}
        <div className="mb-8">
          <EnhancedWeatherWidget />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            <ActiveCrops />
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
