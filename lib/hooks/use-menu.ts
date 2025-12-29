import { useState, useMemo, useCallback } from 'react';
import { useCategories, useMenuItems } from './queries';
import { MenuFilters } from '@/types/menu';
import { PAGINATION } from '@/lib/utils/constants';

export function useMenu() {
  const [filters, setFilters] = useState<MenuFilters>({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    categoryId: undefined,
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
    dietaryTags: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const categories = useCategories(false);
  const menuItems = useMenuItems(filters);

  // Flatten pages for infinite scroll
  const items = useMemo(
    () => menuItems.data?.pages.flatMap((page) => page.items) ?? [],
    [menuItems.data]
  );

  const itemCount = useMemo(
    () => menuItems.data?.pages[0]?.pagination?.total ?? 0,
    [menuItems.data]
  );

  const hasFilters = useMemo(
    () =>
      !!filters.categoryId ||
      !!filters.search ||
      !!filters.minPrice ||
      !!filters.maxPrice ||
      (filters.dietaryTags && filters.dietaryTags.length > 0),
    [filters]
  );

  const updateFilters = useCallback((newFilters: Partial<MenuFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: PAGINATION.DEFAULT_LIMIT,
      categoryId: undefined,
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      dietaryTags: [],
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setCategory = useCallback((categoryId: string | undefined) => {
    setFilters((prev) => ({ ...prev, categoryId, page: 1 }));
  }, []);


  const setDietaryTags = useCallback((dietaryTags: string[]) => {
    setFilters((prev) => ({ ...prev, dietaryTags, page: 1 }));
  }, []);


  const setPriceRange = useCallback((minPrice?: number, maxPrice?: number) => {
    setFilters((prev) => ({ ...prev, minPrice, maxPrice, page: 1 }));
  }, []);

  return {
    categories: categories.data || [],
    items, // Now contains ALL loaded items
    pagination: menuItems.data?.pages[0]?.pagination,

    isLoadingCategories: categories.isLoading,
    isLoadingItems: menuItems.isLoading,
    isLoading: categories.isLoading || menuItems.isLoading,

    categoriesError: categories.error,
    itemsError: menuItems.error,

    itemCount,
    hasFilters,
    filters,

    updateFilters,
    clearFilters,
    setSearch,
    setCategory,
    setDietaryTags,
    setPriceRange, 

    // Infinite scroll
    hasNextPage: menuItems.hasNextPage,
    isFetchingNextPage: menuItems.isFetchingNextPage,
    fetchNextPage: menuItems.fetchNextPage,

    refetchCategories: categories.refetch,
    refetchItems: menuItems.refetch,
  };
}