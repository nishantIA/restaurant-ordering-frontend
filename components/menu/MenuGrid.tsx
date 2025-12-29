'use client';

import { useEffect, useRef } from 'react';
import { MenuItem } from '@/types/menu';
import { MenuCardSkeleton } from './MenuCardSkeleton';
import { MenuCard } from './MenuCard';


interface MenuGridProps {
  items: MenuItem[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export function MenuGrid({
  items,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: MenuGridProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  // Initial loading
  if (isLoading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <MenuCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // No items
  if (!isLoading && items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>

      {/* Loading More */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <MenuCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Intersection Observer Target */}
      <div ref={observerTarget} className="h-10" />

      {/* End of List */}
      {!hasNextPage && items.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          You&apos;ve seen all items ({items.length})
        </div>
      )}
    </div>
  );
}