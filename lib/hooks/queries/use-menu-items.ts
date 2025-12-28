/**
 * useMenuItems Hook - Layer 3 (Data Management)
 * 
 * TanStack Query hook for fetching menu items with filters
 */

import { useQuery } from '@tanstack/react-query';
import { menuService } from '@/lib/services/menu.service';
import { MenuFilters } from '@/types/menu';
import { CACHE_TIME } from '@/lib/utils/constants';

/**
 * Hook to fetch menu items with filters
 */
export function useMenuItems(filters?: MenuFilters) {
  return useQuery({
    queryKey: ['menu-items', filters],
    queryFn: () => menuService.getMenuItems(filters),
    staleTime: CACHE_TIME.MENU,
  });
}