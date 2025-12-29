import { useInfiniteQuery } from '@tanstack/react-query';
import { menuService } from '@/lib/services/menu.service';
import { MenuFilters } from '@/types/menu';
import { CACHE_TIME } from '@/lib/utils/constants';

/**
 * Hook to fetch menu items with infinite scroll
 */
export function useMenuItems(filters?: MenuFilters) {
  return useInfiniteQuery({
    queryKey: ['menu-items', filters],
    queryFn: ({ pageParam = 1 }) => 
      menuService.getMenuItems({
        ...filters,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      return pagination?.hasNext ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: CACHE_TIME.MENU,
  });
}