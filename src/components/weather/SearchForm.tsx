import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchFormProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [city, setCity] = useState('');

  const handleInputChange = (value: string) => {
    const filteredValue = value.replace(/[0-9]/g, '');
    setCity(filteredValue);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <Input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => handleInputChange(e.target.value)}
        disabled={isLoading}
        className="flex-1"
      />
      <Button className="cursor-pointer" type="submit" disabled={isLoading || !city.trim()}>
        {isLoading ? (
          <span className="animate-spin">
            <Search className="size-4" />
          </span>
        ) : (
          <>
            <Search className="size-4" />
            Search
          </>
        )}
      </Button>
    </form>
  );
}
