import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="flex w-full max-w-md items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <AlertCircle className="size-5 shrink-0 text-destructive" />
      <p className="flex-1 text-sm text-destructive">{message}</p>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onDismiss}
        className="cursor-pointer shrink-0"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
