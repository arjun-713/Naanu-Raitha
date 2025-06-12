
import { Cloud, Sun, Droplets } from 'lucide-react';

const WeatherWidget = () => {
  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white bg-opacity-10 rounded-full -ml-6 -mb-6"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-medium opacity-90">Today's Weather</h3>
            <p className="text-xs opacity-75">Mumbai, Maharashtra</p>
          </div>
          <Sun className="w-8 h-8 opacity-80" />
        </div>
        
        <div className="flex items-end space-x-4">
          <div>
            <span className="text-2xl font-bold">28°C</span>
            <p className="text-xs opacity-75">Partly Cloudy</p>
          </div>
          
          <div className="flex space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <Droplets className="w-3 h-3" />
              <span>65%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Cloud className="w-3 h-3" />
              <span>12 km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
