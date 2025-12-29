'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface ActiveFiltersProps {
  categoryName?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  dietaryTags: string[];
  onClearCategory: () => void;
  onClearSearch: () => void;
  onClearPrice: () => void;
  onClearDietary: (tag: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  categoryName,
  search,
  minPrice,
  maxPrice,
  dietaryTags,
  onClearCategory,
  onClearSearch,
  onClearPrice,
  onClearDietary,
  onClearAll,
}: ActiveFiltersProps) {
  const hasFilters =
    categoryName || search || minPrice !== undefined || maxPrice !== undefined || dietaryTags.length > 0;

  if (!hasFilters) return null;

  const getPriceLabel = () => {
    if (minPrice && maxPrice) return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
    if (minPrice) return `From ${formatCurrency(minPrice)}`;
    if (maxPrice) return `Up to ${formatCurrency(maxPrice)}`;
    return '';
  };

  const getDietaryLabel = (tag: string) => {
    const labels: Record<string, string> = {
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      'gluten-free': 'Gluten-Free',
    };
    return labels[tag] || tag;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <span className="text-sm font-medium text-gray-700">Active filters:</span>

      {/* Category */}
      {categoryName && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onClearCategory}
          className="h-7 gap-1"
        >
          Category: {categoryName}
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Search */}
      {search && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onClearSearch}
          className="h-7 gap-1"
        >
          Search: {search}
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Price */}
      {(minPrice !== undefined || maxPrice !== undefined) && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onClearPrice}
          className="h-7 gap-1"
        >
          {getPriceLabel()}
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Dietary Tags */}
      {dietaryTags.map((tag) => (
        <Button
          key={tag}
          variant="secondary"
          size="sm"
          onClick={() => onClearDietary(tag)}
          className="h-7 gap-1"
        >
          {getDietaryLabel(tag)}
          <X className="h-3 w-3" />
        </Button>
      ))}

      {/* Clear All */}
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="h-7 ml-auto"
      >
        Clear All
      </Button>
    </div>
  );
}