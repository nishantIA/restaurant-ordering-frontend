/**
 * Menu Types
 * Based on backend schema
 */

/**
 * Category
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  parentCategoryId?: string;
  itemCount?: number;
  childCategories?: Category[];
}

/**
 * Quantity Types
 */
export type QuantityType = 'UNIT' | 'WEIGHT' | 'VOLUME' | 'SERVING';

/**
 * Customization Types
 */
export type CustomizationType = 'NONE' | 'SIMPLE' | 'COMPLEX_DAG';
export type SimpleCustomizationType = 'SIZE' | 'ADDON' | 'MODIFIER' | 'OPTION';

/**
 * Tax
 */
export interface Tax {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  isInclusive: boolean;
}

/**
 * Simple Customization
 */
export interface SimpleCustomization {
  id: string;
  name: string;
  type: SimpleCustomizationType;
  price: number;
  isActive: boolean;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
}

/**
 * DAG Customization Node
 */
export interface CustomizationNode {
  id: string;
  type: 'GROUP' | 'OPTION' | 'MODIFIER';
  name: string;
  description?: string;
  price: number;
  displayOrder: number;
  data?: unknown;
  children?: CustomizationNode[];
  constraints?: {
    min?: number;
    max?: number;
    required?: boolean;
    default?: string;
  };
}

/**
 * Menu Item
 */
export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  basePrice: number;
  quantityType: QuantityType;
  unit?: string;
  minQuantity: number;
  maxQuantity?: number;
  stepQuantity: number;
  isAvailable: boolean;
  availableQuantity?: number;
  prepTime?: number;
  dietaryTags: string[];
  allergens: string[];
  customizationType: CustomizationType;
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    displayOrder: number;
    isActive: boolean;
  };
  taxes: Tax[];
  simpleCustomizations?: SimpleCustomization[];
  dagCustomizations?: CustomizationNode[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Menu Items Response (with pagination)
 */
export interface MenuItemsResponse {
  items: MenuItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Menu Filters
 */
export interface MenuFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  dietaryTags?: string[];
  sortBy?: 'name' | 'basePrice' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}