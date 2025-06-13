import { supabase } from '@/integrations/supabase/client';

interface WeatherData {
  temperature: number;
  rainChance: number;
  cloudType: string;
  windSpeed: number;
  location: string;
}

export const fetchWeatherData = async (): Promise<WeatherData | null> => {
  try {
    // Get user's location from profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('state, district')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    // Use OpenWeatherMap API to get weather data
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const location = `${profile.district},${profile.state},IN`;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      rainChance: data.rain ? Math.round(data.rain['1h'] * 100) : 0,
      cloudType: data.weather[0].description,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      location: `${profile.district}, ${profile.state}`
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}; 