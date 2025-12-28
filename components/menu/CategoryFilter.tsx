/**
 * CategoryFilter Component
 * Hierarchical category filtering with dropdowns for parent categories
 */

'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';

interface CategoryFilterProps {
  categories: Category[];
  selected?: string;
  onSelect: (categoryId: string | undefined) => void;
  isLoading?: boolean;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  isLoading,
}: CategoryFilterProps) {
  // Find selected category (could be parent or child)
  const selectedCategory = useMemo(() => {
    if (!selected) return null;
    
    // Check if selected is a top-level category
    let found = categories.find(c => c.id === selected);
    if (found) return found;
    
    // Check if selected is a child category
    for (const category of categories) {
      if (category.childCategories) {
        found = category.childCategories.find(c => c.id === selected);
        if (found) return found;
      }
    }
    
    return null;
  }, [categories, selected]);

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* All Items */}
      <Button
        variant={!selected ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect(undefined)}
        className="flex-shrink-0"
      >
        All Items
      </Button>

      {/* Category Buttons/Dropdowns */}
      {categories.map((category) => {
        // Check if this category has children
        const hasChildren = category.childCategories && category.childCategories.length > 0;
        
        // Check if this category or any of its children is selected
        const isSelected = selected === category.id;
        const hasSelectedChild = hasChildren && category.childCategories!.some(
          child => child.id === selected
        );
        const isActive = isSelected || hasSelectedChild;

        // Category without children - simple button
        if (!hasChildren) {
          return (
            <Button
              key={category.id}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelect(category.id)}
              className="flex-shrink-0 gap-2"
            >
              {category.name}
              {category.itemCount !== undefined && category.itemCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {category.itemCount}
                </Badge>
              )}
            </Button>
          );
        }

        // Category with children - dropdown
        return (
          <DropdownMenu key={category.id}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className="flex-shrink-0 gap-1"
              >
                {selectedCategory && hasSelectedChild 
                  ? selectedCategory.name 
                  : category.name}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {/* All items in this parent category */}
              <DropdownMenuItem
                onClick={() => onSelect(category.id)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span>All {category.name}</span>
                  {category.itemCount !== undefined && category.itemCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {category.itemCount}
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Child categories */}
              {category.childCategories!.map((child) => (
                <DropdownMenuItem
                  key={child.id}
                  onClick={() => onSelect(child.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{child.name}</span>
                    {child.itemCount !== undefined && child.itemCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {child.itemCount}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
}