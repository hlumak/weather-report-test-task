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

export interface NominatimResponse {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
  };
}

export interface OneCallResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
}

export interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}
