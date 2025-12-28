/**
 * MenuItemCard Component
 * Displays individual menu item with add to cart functionality
 */

'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { formatCurrency } from '@/lib/utils/format';
import { useUIStore } from '@/lib/stores/ui-store';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const openItemModal = useUIStore((state) => state.openItemModal);

  const handleClick = () => {
    openItemModal(item.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-6xl">🍽️</span>
            </div>
          )}

          {/* Availability Badge */}
          {!item.isAvailable && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">Unavailable</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Name */}
          <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Tags */}
          {item.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.dietaryTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Prep Time */}
          {item.prepTime && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{item.prepTime} min</span>
            </div>
          )}

          {/* Price and Add Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold">
              {formatCurrency(item.basePrice)}
            </span>
            <Button
              size="sm"
              onClick={handleClick}
              disabled={!item.isAvailable}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}