import { useState, useCallback } from 'react';
import type { WeatherData } from '@/types/weather';
import { fetchWeather } from '@/services/weatherApi';

interface UseWeatherResult {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  fetchWeatherForCity: (city: string) => Promise<void>;
  clearError: () => void;
}

export function useWeather(): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherForCity = useCallback(async (city: string) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    weather,
    isLoading,
    error,
    fetchWeatherForCity,
    clearError,
  };
}
