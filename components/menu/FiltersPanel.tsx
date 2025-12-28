import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceRangeFilter } from './PriceRangeFilter';
import { DietaryFilter } from './DietaryFilter';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FiltersPanelProps {
  minPrice: number;
  maxPrice: number;
  dietaryTags: string[];
  onPriceChange: (min: number, max: number) => void;
  onDietaryChange: (tags: string[]) => void;
  onClearAll: () => void;
}

export function FiltersPanel({
  minPrice,
  maxPrice,
  dietaryTags,
  onPriceChange,
  onDietaryChange,
  onClearAll,
}: FiltersPanelProps) {
  const hasActiveFilters = minPrice > 0 || maxPrice < 50 || dietaryTags.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <PriceRangeFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={onPriceChange}
        />
        <DietaryFilter
          selectedTags={dietaryTags}
          onTagsChange={onDietaryChange}
        />
      </CardContent>
    </Card>
  );
}