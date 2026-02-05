import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { WeatherData } from '@/types/weather';
import { fetchWeather, abortCurrentRequest } from '@/services/weatherApi';

const STALE_TIME = 10 * 60 * 1000;

interface UseWeatherResult {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  fetchWeatherForCity: (city: string) => void;
  clearError: () => void;
}

export function useWeather(): UseWeatherResult {
  const [city, setCity] = useState<string | null>(null);
  const [manualError, setManualError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error: queryError, isFetching } = useQuery({
    queryKey: ['weather', city],
    queryFn: () => fetchWeather(city!),
    enabled: !!city,
    staleTime: STALE_TIME,
    gcTime: STALE_TIME,
    retry: false,
  });

  const fetchWeatherForCity = useCallback((newCity: string) => {
    const trimmedCity = newCity.trim();
    if (!trimmedCity) {
      setManualError('Please enter a city name');
      return;
    }

    setManualError(null);

    if (city !== trimmedCity) {
      abortCurrentRequest();
    }

    if (city === trimmedCity) {
      queryClient.invalidateQueries({ queryKey: ['weather', city] });
    } else {
      setCity(trimmedCity);
    }
  }, [city, queryClient]);

  const clearError = useCallback(() => {
    setManualError(null);
  }, []);

  const errorMessage = manualError || (queryError instanceof Error ? queryError.message : null);

  return {
    weather: data ?? null,
    isLoading: isLoading || isFetching,
    error: errorMessage,
    fetchWeatherForCity,
    clearError,
  };
}
