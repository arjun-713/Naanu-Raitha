import { supabase } from '@/integrations/supabase/client';
import { WeatherData } from '@/types/weather';

export const fetchWeatherData = async (): Promise<WeatherData | null> => {
  try {
    // Get user's location from profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('state, district, sub_district')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    // Use OpenWeatherMap API to get weather data
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    
    // Fix: Check for sub_district instead of subDistrict
    const location = profile.sub_district
      ? `${profile.sub_district},${profile.district},${profile.state},IN`
      : `${profile.district},${profile.state},IN`;
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Fix: Check if rain data exists and handle it properly
    let rainChance = 0;
    if (data.rain) {
      // Rain data might be in '1h' or '3h' format
      rainChance = data.rain['1h'] ? Math.round(data.rain['1h'] * 100) : 
                   data.rain['3h'] ? Math.round(data.rain['3h'] * 100) : 0;
    }

    return {
      temperature: Math.round(data.main.temp),
      rainChance,
      cloudType: data.weather[0].description,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      location: profile.sub_district 
        ? `${profile.sub_district}, ${profile.district}, ${profile.state}`
        : `${profile.district}, ${profile.state}`,
      humidity: data.main.humidity,
      feelsLike: Math.round(data.main.feels_like),
      conditionCode: data.weather[0].id,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : undefined, // Convert m to km
      // Fix: UV Index is not available in current weather API, need separate call
      uvIndex: undefined // Remove data.uvi as it's not available in current weather endpoint
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Optional: Enhanced version with UV Index (requires separate API call)
export const fetchWeatherDataWithUV = async (): Promise<WeatherData | null> => {
  try {
    // Get user's location from profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('state, district, sub_district')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    
    if (!API_KEY) {
      throw new Error('OpenWeather API key is not configured');
    }
    
    const location = profile.sub_district
      ? `${profile.sub_district},${profile.district},${profile.state},IN`
      : `${profile.district},${profile.state},IN`;
    
    // First, get current weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
    );

    if (!weatherResponse.ok) {
      throw new Error(`Failed to fetch weather data: ${weatherResponse.status} ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();

    // For UV Index, we need coordinates and the One Call API
    let uvIndex = undefined;
    if (weatherData.coord) {
      try {
        const uvResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`
        );
        
        if (uvResponse.ok) {
          const uvData = await uvResponse.json();
          uvIndex = Math.round(uvData.value);
        }
      } catch (uvError) {
        console.warn('Failed to fetch UV data:', uvError);
      }
    }

    let rainChance = 0;
    if (weatherData.rain) {
      rainChance = weatherData.rain['1h'] ? Math.round(weatherData.rain['1h'] * 100) : 
                   weatherData.rain['3h'] ? Math.round(weatherData.rain['3h'] * 100) : 0;
    }

    return {
      temperature: Math.round(weatherData.main.temp),
      rainChance,
      cloudType: weatherData.weather[0].description,
      windSpeed: Math.round(weatherData.wind.speed * 3.6),
      location: profile.sub_district 
        ? `${profile.sub_district}, ${profile.district}, ${profile.state}`
        : `${profile.district}, ${profile.state}`,
      humidity: weatherData.main.humidity,
      feelsLike: Math.round(weatherData.main.feels_like),
      conditionCode: weatherData.weather[0].id,
      visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : undefined,
      uvIndex
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};