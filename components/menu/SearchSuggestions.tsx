/**
 * SearchSuggestions Component
 * Dropdown showing autocomplete suggestions
 */

'use client';

import { useUIStore } from '@/lib/stores/ui-store';
import { MenuItem } from '@/types/menu';
import { Loader2 } from 'lucide-react';

interface SearchSuggestionsProps {
  items: MenuItem[];
  isLoading: boolean;
  searchTerm: string;
  onClose: () => void;
}

export function SearchSuggestions({
  items,
  isLoading,
  searchTerm,
  onClose,
}: SearchSuggestionsProps) {
  const { openItemModal } = useUIStore();

  const handleItemClick = (item: MenuItem) => {
    openItemModal(item.id);
    onClose();
  };

  // Don't show if no search term or less than 2 chars
  if (!searchTerm || searchTerm.length < 2) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-950 border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {isLoading && (
        <div className="p-4 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Searching...
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="p-4 text-center text-muted-foreground text-sm">
          No items found for {searchTerm}
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="py-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                  {item.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {item.category.name}
                </div>
              </div>
              <div className="ml-3 font-semibold text-sm shrink-0">
                ${item.basePrice.toFixed(2)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}