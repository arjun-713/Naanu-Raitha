/**
 * Weather data type definitions
 */

export interface WeatherData {
  /**
   * Current temperature in Celsius
   */
  temperature: number;
  
  /**
   * Chance of rain as a percentage
   */
  rainChance: number;
  
  /**
   * Type of cloud cover (e.g., "clear", "scattered clouds", "overcast")
   */
  cloudType: string;
  
  /**
   * Wind speed in km/h
   */
  windSpeed: number;
  
  /**
   * Location name (typically city/district)
   */
  location: string;
  
  /**
   * Weather condition code from API
   */
  conditionCode?: number;
  
  /**
   * Humidity percentage
   */
  humidity?: number;
  
  /**
   * UV index
   */
  uvIndex?: number;
  
  /**
   * Visibility in kilometers
   */
  visibility?: number;
  
  /**
   * Feels like temperature in Celsius
   */
  feelsLike?: number;
}