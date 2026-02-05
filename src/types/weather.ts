export interface WeatherData {
  city: string;
  temperature: number;
  condition: WeatherCondition;
  conditionDescription: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export type WeatherCondition = 'sunny' | 'rainy' | 'snowy' | 'cloudy';

export interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}
