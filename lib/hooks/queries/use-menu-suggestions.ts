/**
 * useMenuSuggestions Hook
 * Fetches menu items for autocomplete suggestions
 */

import { useQuery } from '@tanstack/react-query';
import { menuService } from '@/lib/services/menu.service';

/**
 * Hook to fetch menu suggestions based on search query
 * Only triggers if search term is 2+ characters
 */
export function useMenuSuggestions(searchTerm: string, enabled = true) {
  return useQuery({
    queryKey: ['menu-suggestions', searchTerm],
    queryFn: () =>
      menuService.getMenuItems({
        search: searchTerm,
        limit: 5, // Only show top 5 suggestions
        page: 1,
      }),
    enabled: enabled && searchTerm.length >= 2, // Only search if 2+ chars
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}