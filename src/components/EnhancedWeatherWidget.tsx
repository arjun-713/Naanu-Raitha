import React, { useState, useEffect } from 'react';
import { Thermometer, CloudRain, Cloud, Wind } from 'lucide-react';
import { fetchWeatherData } from '@/utils/weatherData';

const EnhancedWeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const data = await fetchWeatherData();
        if (data) {
          setWeatherData(data);
        } else {
          setError('Unable to fetch weather data');
        }
      } catch (err) {
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
    // Refresh weather data every 30 minutes
    const interval = setInterval(loadWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white animate-pulse">
        <div className="h-8 bg-white bg-opacity-20 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white bg-opacity-20 rounded-lg p-4 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
        <div className="text-center">
          <p className="text-sm opacity-75">{error || 'Weather data unavailable'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Today's Weather</h3>
          <p className="text-sm opacity-75">{weatherData.location}</p>
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
          <div className="text-lg font-bold capitalize">{weatherData.cloudType}</div>
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
