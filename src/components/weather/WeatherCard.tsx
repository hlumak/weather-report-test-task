import { memo } from 'react';
import { Cloud, CloudRain, CloudSnow, Droplets, Sun, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WeatherData, WeatherCondition } from '@/types/weather';
import { cn } from '@/lib/utils';

interface WeatherCardProps {
  weather: WeatherData;
}

function getWeatherIcon(condition: WeatherCondition) {
  const iconProps = { className: 'size-16' };

  switch (condition) {
    case 'sunny':
      return <Sun {...iconProps} />;
    case 'rainy':
      return <CloudRain {...iconProps} />;
    case 'snowy':
      return <CloudSnow {...iconProps} />;
    case 'cloudy':
    default:
      return <Cloud {...iconProps} />;
  }
}

export const WeatherCard = memo(function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{weather.city}</CardTitle>
        <p className="text-muted-foreground capitalize">{weather.conditionDescription}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          <div className="text-primary">
            {getWeatherIcon(weather.condition)}
          </div>
          <span className="text-6xl font-light">{weather.temperature}°C</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <WeatherDetail
            icon={<Droplets className="size-5" />}
            label="Humidity"
            value={`${weather.humidity}%`}
          />
          <WeatherDetail
            icon={<Wind className="size-5" />}
            label="Wind Speed"
            value={`${weather.windSpeed} m/s`}
          />
        </div>
      </CardContent>
    </Card>
  );
});

interface WeatherDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function WeatherDetail({ icon, label, value }: WeatherDetailProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg p-3",
      "bg-muted/50"
    )}>
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
