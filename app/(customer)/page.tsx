/**
 * Menu Page (Main Customer Page)
 * Displays menu items with filters, search, and categories
 */

'use client';

import { useMenu } from '@/lib/hooks/use-menu';
import { SearchBar } from '@/components/menu/SearchBar';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { MenuGrid } from '@/components/menu/MenuGrid';
import { ErrorDisplay } from '@/components/shared/ErrorDisplay';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function MenuPage() {
  const {
    categories,
    items,
    pagination,
    isLoadingCategories,
    isLoadingItems,
    categoriesError,
    itemsError,
    filters,
    hasFilters,
    setSearch,
    setCategory,
    setPage,
    clearFilters,
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
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}