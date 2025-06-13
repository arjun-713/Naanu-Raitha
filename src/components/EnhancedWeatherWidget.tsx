
import React from 'react';
import { Thermometer, CloudRain, Cloud, Wind } from 'lucide-react';

const EnhancedWeatherWidget = () => {
  // Mock weather data - you can replace with actual API data
  const weatherData = {
    temperature: 28,
    rainChance: 65,
    cloudType: 'Partly Cloudy',
    windSpeed: 12
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Today's Weather</h3>
          <p className="text-sm opacity-75">Mumbai, Maharashtra</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <Thermometer className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
          <div className="text-xs opacity-75">Temperature</div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <CloudRain className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{weatherData.rainChance}%</div>
          <div className="text-xs opacity-75">Rain Chance</div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <Cloud className="w-8 h-8 mx-auto mb-2" />
          <div className="text-lg font-bold">{weatherData.cloudType}</div>
          <div className="text-xs opacity-75">Cloud Type</div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <Wind className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{weatherData.windSpeed}</div>
          <div className="text-xs opacity-75">km/h Wind</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWeatherWidget;
