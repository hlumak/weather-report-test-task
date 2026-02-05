import { z } from 'zod';
import type { WeatherData, WeatherCondition, CacheEntry } from '@/types/weather';

const CACHE_DURATION_MS = 10 * 60 * 1000;
const weatherCache = new Map<string, CacheEntry>();

const NominatimAddressSchema = z.object({
  city: z.string().optional(),
  town: z.string().optional(),
  village: z.string().optional(),
  municipality: z.string().optional(),
  country: z.string().optional(),
}).optional();

const NominatimResponseSchema = z.array(z.object({
  place_id: z.number(),
  lat: z.string(),
  lon: z.string(),
  display_name: z.string(),
  name: z.string().optional(),
  address: NominatimAddressSchema,
}));

const OneCallWeatherItemSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

const OneCallCurrentSchema = z.object({
  dt: z.number(),
  temp: z.number(),
  feels_like: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  clouds: z.number(),
  visibility: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  weather: z.array(OneCallWeatherItemSchema).min(1),
});

const OneCallResponseSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  timezone_offset: z.number(),
  current: OneCallCurrentSchema,
});

export type NominatimResponse = z.infer<typeof NominatimResponseSchema>[number];
export type OneCallResponse = z.infer<typeof OneCallResponseSchema>;

let currentAbortController: AbortController | null = null;

export function abortCurrentRequest(): void {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
}

function mapWeatherCondition(weatherId: number): WeatherCondition {
  if (weatherId >= 200 && weatherId < 600) {
    return 'rainy';
  } else if (weatherId >= 600 && weatherId < 700) {
    return 'snowy';
  } else if (weatherId === 800) {
    return 'sunny';
  } else {
    return 'cloudy';
  }
}

function getCachedWeather(city: string): WeatherData | null {
  const cacheKey = city.toLowerCase().trim();
  const cached = weatherCache.get(cacheKey);

  if (!cached) {
    return null;
  }

  const now = Date.now();
  const age = now - cached.timestamp;

  if (age < CACHE_DURATION_MS) {
    return cached.data;
  }

  weatherCache.delete(cacheKey);
  return null;
}

function setCachedWeather(city: string, data: WeatherData): void {
  const cacheKey = city.toLowerCase().trim();
  weatherCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
}

async function geocodeCity(city: string, signal: AbortSignal): Promise<{ lat: number; lon: number; name: string }> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&addressdetails=1`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'WeatherForecastApp/1.0',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.statusText}`);
  }

  const rawData: unknown = await response.json();
  const parseResult = NominatimResponseSchema.safeParse(rawData);

  if (!parseResult.success) {
    throw new Error('Invalid response from geocoding service');
  }

  const data = parseResult.data;

  if (data.length === 0) {
    throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
  }

  const result = data[0];

  const cityName = result.address?.city
    || result.address?.town
    || result.address?.village
    || result.address?.municipality
    || result.name
    || city;

  return {
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    name: cityName,
  };
}

async function fetchOneCallWeather(lat: number, lon: number, apiKey: string, signal: AbortSignal): Promise<OneCallResponse> {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&exclude=minutely,hourly,daily,alerts`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid API key or One Call API 3.0 subscription required. Please check your API key and ensure you have subscribed to One Call API 3.0.');
    }
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  const rawData: unknown = await response.json();
  const parseResult = OneCallResponseSchema.safeParse(rawData);

  if (!parseResult.success) {
    throw new Error('Invalid response from weather service');
  }

  return parseResult.data;
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  abortCurrentRequest();

  const cachedData = getCachedWeather(city);
  if (cachedData) {
    return cachedData;
  }

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenWeatherMap API key is not configured. Please set VITE_OPENWEATHER_API_KEY in your .env file.');
  }

  currentAbortController = new AbortController();
  const signal = currentAbortController.signal;

  try {
    const geoData = await geocodeCity(city, signal);
    const weatherResponse = await fetchOneCallWeather(geoData.lat, geoData.lon, apiKey, signal);

    const weatherData: WeatherData = {
      city: geoData.name,
      temperature: Math.round(weatherResponse.current.temp),
      condition: mapWeatherCondition(weatherResponse.current.weather[0].id),
      conditionDescription: weatherResponse.current.weather[0].description,
      humidity: weatherResponse.current.humidity,
      windSpeed: Math.round(weatherResponse.current.wind_speed * 10) / 10,
      icon: weatherResponse.current.weather[0].icon,
    };

    setCachedWeather(city, weatherData);

    return weatherData;
  } finally {
    currentAbortController = null;
  }
}

export function clearWeatherCache(): void {
  weatherCache.clear();
}
