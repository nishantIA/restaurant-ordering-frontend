/**
 * SearchBar Component with Autocomplete
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMenuSuggestions } from '@/lib/hooks/queries';
import { SearchSuggestions } from './SearchSuggestions';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search for dishes...',
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce the input for main search (300ms)
  const debouncedValue = useDebounce(inputValue, 300);

  // Fetch suggestions
  const { data: suggestionsData, isLoading } = useMenuSuggestions(
    inputValue,
    showSuggestions
  );

  // Update parent when debounced value changes
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(newValue.length >= 2);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (inputValue.length >= 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <SearchSuggestions
          items={suggestionsData?.items || []}
          isLoading={isLoading}
          searchTerm={inputValue}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}