import type { WeatherData, WeatherCondition, NominatimResponse, OneCallResponse, CacheEntry } from '@/types/weather';

const CACHE_DURATION_MS = 10 * 60 * 1000;
const weatherCache = new Map<string, CacheEntry>();

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
    console.log(`[Cache HIT] Returning cached data for "${city}" (age: ${Math.round(age / 1000)}s)`);
    return cached.data;
  }

  console.log(`[Cache EXPIRED] Cache for "${city}" is stale (age: ${Math.round(age / 1000)}s)`);
  weatherCache.delete(cacheKey);
  return null;
}

function setCachedWeather(city: string, data: WeatherData): void {
  const cacheKey = city.toLowerCase().trim();
  weatherCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
  console.log(`[Cache SET] Stored weather data for "${city}"`);
}

async function geocodeCity(city: string): Promise<{ lat: number; lon: number; name: string }> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&addressdetails=1`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'WeatherForecastApp/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.statusText}`);
  }

  const data: NominatimResponse[] = await response.json();

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

async function fetchOneCallWeather(lat: number, lon: number, apiKey: string): Promise<OneCallResponse> {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&exclude=minutely,hourly,daily,alerts`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid API key or One Call API 3.0 subscription required. Please check your API key and ensure you have subscribed to One Call API 3.0.');
    }
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  const cachedData = getCachedWeather(city);
  if (cachedData) {
    return cachedData;
  }

  console.log(`[Cache MISS] Fetching fresh data for "${city}"`);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenWeatherMap API key is not configured. Please set VITE_OPENWEATHER_API_KEY in your .env file.');
  }

  const geoData = await geocodeCity(city);

  const weatherResponse = await fetchOneCallWeather(geoData.lat, geoData.lon, apiKey);

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
}

export function clearWeatherCache(): void {
  weatherCache.clear();
  console.log('[Cache CLEARED] All weather cache entries removed');
}
