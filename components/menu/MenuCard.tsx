'use client';

import { MenuItem } from '@/types/menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, Leaf } from 'lucide-react';
import Image from 'next/image';
import { useUIStore } from '@/lib/stores/ui-store';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const openItemModal = useUIStore(state => state.openItemModal);

  const handleCardClick = () => {
    console.log('Card clicked, opening modal for:', item.id); // DEBUG
    openItemModal(item.id);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    console.log("first")
    e.stopPropagation();
    console.log('Add button clicked, opening modal for:', item.id); // DEBUG
    openItemModal(item.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 text-4xl">🍽️</span>
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.dietaryTags?.includes('vegetarian') && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
              <Leaf className="h-3 w-3 mr-1" />
              Veg
            </Badge>
          )}
          {item.dietaryTags?.includes('vegan') && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">
              Vegan
            </Badge>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-700 hover:bg-green-800 text-white border-0 flex items-center gap-1">
            <Star className="h-3 w-3 fill-white" />
            4.2
          </Badge>
        </div>

        {/* Availability Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Currently Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name & Category */}
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{item.category?.name}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 min-h-10">
          {item.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
          {item.prepTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{item.prepTime} mins</span>
            </div>
          )}
          {item.allergens && item.allergens.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-orange-600">⚠️</span>
              <span className="text-orange-600">{item.allergens.length} allergens</span>
            </div>
          )}
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                ${item.basePrice}
              </span>
              {item.quantityType !== 'UNIT' && (
                <span className="text-xs text-gray-500">/ {item.unit}</span>
              )}
            </div>
          </div>
          
          <Button
            onClick={handleAddClick}
            disabled={!item.isAvailable}
            size="sm"
            className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold px-6 shadow-md hover:shadow-lg transition-all"
          >
            ADD +
          </Button>
        </div>
      </div>
    </div>
  );
}