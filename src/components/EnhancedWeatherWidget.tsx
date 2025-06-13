import React, { useState, useEffect } from 'react';
import { Thermometer, CloudRain, Cloud, Wind, RefreshCw } from 'lucide-react';
import { fetchWeatherData } from '@/utils/weatherData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherData } from '@/types/weather';

const EnhancedWeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData();
      if (data) {
        setWeatherData(data);
        setLastUpdated(new Date());
      } else {
        setError('Unable to fetch weather data');
      }
    } catch (err) {
      console.error('Weather data fetch error:', err);
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
    // Refresh weather data every 30 minutes
    const interval = setInterval(loadWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    loadWeatherData();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-40 bg-white bg-opacity-20 rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white bg-opacity-20 rounded-lg p-4 h-24 flex flex-col items-center justify-center">
              <Skeleton className="h-8 w-8 mb-2 bg-white bg-opacity-20 rounded-full" />
              <Skeleton className="h-6 w-16 mb-1 bg-white bg-opacity-20 rounded" />
              <Skeleton className="h-4 w-20 bg-white bg-opacity-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
        <div className="text-center">
          <p className="text-sm opacity-75 mb-4">{error || 'Weather data unavailable'}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30"
            onClick={handleManualRefresh}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white opacity-75 hover:opacity-100 hover:bg-white hover:bg-opacity-10"
          onClick={handleManualRefresh}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
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
      
      {lastUpdated && (
        <div className="mt-4 text-xs opacity-50 text-right">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default EnhancedWeatherWidget;
