'use client';

import { useMenu } from '@/lib/hooks/use-menu';
import { SearchBar } from '@/components/menu/SearchBar';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { MenuGrid } from '@/components/menu/MenuGrid';
import { ErrorDisplay } from '@/components/shared/ErrorDisplay';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DietaryFilter } from '@/components/menu/DietaryFilter';

export default function MenuPage() {
  const {
    categories,
    items,
    isLoadingCategories,
    isLoadingItems,
    categoriesError,
    itemsError,
    filters,
    hasFilters,
    setDietaryTags,
    setSearch,
    setCategory,
    clearFilters,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetchItems,
    refetchCategories,
  } = useMenu();

  // Error handling
  if (categoriesError && !isLoadingCategories) {
    return (
      <ErrorDisplay
        error={categoriesError}
        onRetry={refetchCategories}
      />
    );
  }

  if (itemsError && !isLoadingItems) {
    return (
      <ErrorDisplay
        error={itemsError}
        onRetry={refetchItems}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Our Menu</h1>
        <p className="text-muted-foreground">
          Discover our delicious selection of dishes
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={filters.search || ''}
        onChange={setSearch}
        placeholder="Search for dishes..."
      />

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selected={filters.categoryId}
        onSelect={setCategory}
        isLoading={isLoadingCategories}
      />

      <div>
        <h3 className="text-sm font-medium mb-3">Dietary Preferences</h3>
        <DietaryFilter
          selected={filters.dietaryTags || []}
          onChange={setDietaryTags}
        />
      </div>

      {/* Active Filters Indicator */}
      {hasFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters active</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* Menu Grid */}
      <MenuGrid
        items={items}
        isLoading={isLoadingItems}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  );
}