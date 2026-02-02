import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Fetching weather data...</p>
    </div>
  );
}
