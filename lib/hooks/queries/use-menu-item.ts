/**
 * useMenuItem Hook - Layer 3 (Data Management)
 * 
 * TanStack Query hook for fetching single menu item with full details
 */

import { useQuery } from '@tanstack/react-query';
import { menuService } from '@/lib/services/menu.service';
import { CACHE_TIME } from '@/lib/utils/constants';

/**
 * Hook to fetch single menu item by ID or slug
 */
export function useMenuItem(idOrSlug: string) {
  return useQuery({
    queryKey: ['menu-item', idOrSlug],
    queryFn: () => menuService.getMenuItem(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: CACHE_TIME.MENU,
  });
}