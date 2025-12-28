import { useState, useMemo, useCallback } from 'react'; // Add useCallback
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

  const itemCount = useMemo(
    () => menuItems.data?.pagination?.total ?? 0,
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

  // Actions
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

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setCategory = useCallback((categoryId: string | undefined) => {
    setFilters((prev) => ({ ...prev, categoryId, page: 1 }));
  }, []);

  return {
    categories: categories.data || [],
    items: menuItems.data?.items || [],
    pagination: menuItems.data?.pagination,

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
    setPage,
    setSearch,
    setCategory,

    refetchCategories: categories.refetch,
    refetchItems: menuItems.refetch,
  };
}