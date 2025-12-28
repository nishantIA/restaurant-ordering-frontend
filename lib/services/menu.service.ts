/**
 * Menu Service - Layer 2 (Data Access)
 * 
 * Design Pattern: Repository Pattern
 * SOLID Principle: Single Responsibility (only handles menu API calls)
 * 
 * Responsibilities:
 * - Fetch categories
 * - Fetch menu items with filters
 * - Fetch single menu item
 */

import { apiClient } from '@/lib/api/client';
import { Category, MenuItem, MenuItemsResponse, MenuFilters } from '@/types/menu';

/**
 * Menu Service Object
 * Contains all menu-related API calls
 */
export const menuService = {
  /**
   * Get all categories
   */
  async getCategories(params?: {
    includeChildren?: boolean;
    includeItemCount?: boolean;
    onlyActive?: boolean;
  }): Promise<Category[]> {
    return apiClient.get<Category[]>('menu/categories', {
      params: (params || {}) as Record<string, unknown>,
    });
  },

  /**
   * Get single category by ID or slug
   */
  async getCategory(idOrSlug: string): Promise<Category> {
    return apiClient.get<Category>(`menu/categories/${idOrSlug}`);
  },

  /**
   * Get menu items with filters and pagination
   */
  async getMenuItems(filters?: MenuFilters): Promise<MenuItemsResponse> {
    const response = await apiClient.getPaginated<MenuItem[]>('menu/items', {
      params: (filters || {}) as Record<string, unknown>,
    });

    return {
      items: response.data,
      pagination: response.pagination,
    };
  },

  /**
   * Get single menu item by ID or slug
   */
  async getMenuItem(idOrSlug: string): Promise<MenuItem> {
    return apiClient.get<MenuItem>(`menu/items/${idOrSlug}`);
  },
};