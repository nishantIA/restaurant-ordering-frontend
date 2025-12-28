/**
 * MenuGrid Component
 * Displays menu items in a responsive grid with pagination
 */

'use client';

import { MenuItem } from '@/types/menu';
import { MenuItemCard } from './MenuItemCard';
import { MenuSkeleton } from './MenuSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, UtensilsCrossed } from 'lucide-react';

interface MenuGridProps {
  items: MenuItem[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  onPageChange?: (page: number) => void;
}

export function MenuGrid({
  items,
  isLoading,
  pagination,
  onPageChange,
}: MenuGridProps) {
  // Loading state
  if (isLoading) {
    return <MenuSkeleton count={6} />;
  }

  // Empty state
  if (items.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="No items found"
        description="Try adjusting your filters or search query"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={!pagination.hasPrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={!pagination.hasNext}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Items count */}
      {pagination && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {items.length} of {pagination.total} items
        </div>
      )}
    </div>
  );
}