'use client';

import type { CartItem } from '@/types/cart';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/lib/hooks/use-cart';

interface CartItemProps {
  item: CartItem;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem, isUpdating } = useCart();

  const handleIncrement = () => {
    updateItem({ 
      itemId: item.id, 
      data: { quantity: item.quantity + 1 } 
    });
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateItem({ 
        itemId: item.id, 
        data: { quantity: item.quantity - 1 } 
      });
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100">
      {/* Image */}
      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-gray-900 truncate">{item.name}</h4>

        {/* Customizations */}
        {item.customizations && item.customizations.length > 0 && (
          <div className="mt-1">
            {item.customizations.map((customization, index) => (
              <p key={index} className="text-xs text-gray-500">
                + {customization.name}
              </p>
            ))}
          </div>
        )}

        {/* Special Instructions */}
        {item.specialInstructions && (
          <p className="text-xs text-gray-500 italic mt-1">Note: {item.specialInstructions}</p>
        )}

        {/* Quantity & Price */}
        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={handleDecrement}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={handleIncrement}
              disabled={isUpdating}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">${item.itemTotal.toFixed(2)}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-500">${item.basePrice.toFixed(2)} each</p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-400 hover:text-red-600 shrink-0"
        onClick={handleRemove}
        disabled={isUpdating}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}