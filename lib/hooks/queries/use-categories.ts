/**
 * useCategories Hook - Layer 3 (Data Management)
 * 
 * TanStack Query hook for fetching categories
 */

import { useQuery } from '@tanstack/react-query';
import { menuService } from '@/lib/services/menu.service';
import { CACHE_TIME } from '@/lib/utils/constants';

/**
 * Hook to fetch all categories
 */
export function useCategories(includeChildren = true) {
  return useQuery({
    queryKey: ['categories', includeChildren],
    queryFn: () =>
      menuService.getCategories({
        includeChildren,
        includeItemCount: true,
        onlyActive: true,
      }),
    staleTime: CACHE_TIME.CATEGORIES,
  });
}

/**
 * Hook to fetch single category
 */
export function useCategory(idOrSlug: string) {
  return useQuery({
    queryKey: ['category', idOrSlug],
    queryFn: () => menuService.getCategory(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: CACHE_TIME.CATEGORIES,
  });
}