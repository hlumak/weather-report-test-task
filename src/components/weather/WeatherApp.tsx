import { CloudSun } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import type { WeatherCondition } from '@/types/weather';
import { cn } from '@/lib/utils';
import { SearchForm } from './SearchForm';
import { WeatherCard } from './WeatherCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

const weatherThemes: Record<WeatherCondition, string> = {
  sunny: 'from-amber-100 via-orange-50 to-yellow-100',
  rainy: 'from-slate-300 via-blue-200 to-gray-300',
  snowy: 'from-slate-50 via-blue-50 to-white',
  cloudy: 'from-gray-200 via-slate-100 to-gray-100',
};

const defaultTheme = 'from-blue-50 via-sky-50 to-indigo-50';

export function WeatherApp() {
  const { weather, isLoading, error, fetchWeatherForCity, clearError } = useWeather();

  const currentTheme = weather ? weatherThemes[weather.condition] : defaultTheme;

  return (
    <div
      className={cn(
        'min-h-screen w-full bg-linear-to-br transition-all duration-700',
        currentTheme
      )}
    >
      <div className="container mx-auto flex min-h-screen flex-col items-center px-4 py-8">
        <header className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <CloudSun className="size-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Weather Forecast</h1>
          </div>
          <p className="text-muted-foreground">
            Search for a city to get the current weather conditions
          </p>
        </header>

        <SearchForm onSearch={fetchWeatherForCity} isLoading={isLoading} />

        <main className="mt-8 flex w-full flex-col items-center">
          {error && <ErrorMessage message={error} onDismiss={clearError} />}

          {isLoading && <LoadingSpinner />}

          {!isLoading && weather && <WeatherCard weather={weather} />}

          {!isLoading && !weather && !error && (
            <div className="py-12 text-center text-muted-foreground">
              <CloudSun className="mx-auto mb-4 size-16 opacity-50" />
              <p>Enter a city name above to see the weather forecast</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
