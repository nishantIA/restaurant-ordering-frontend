'use client';

import type { CartItem } from '@/types/cart';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/format';

interface CheckoutItemProps {
  item: CartItem;
}

export function CheckoutItem({ item }: CheckoutItemProps) {
  return (
    <div className="flex gap-3">
      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
            <p className="text-xs text-gray-500">
              Qty: {item.quantity} {item.unit}
            </p>

            {item.customizations && item.customizations.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {item.customizations.map((customization, index) => (
                  <p key={index} className="text-xs text-gray-500">
                    + {customization.name}
                    {customization.price > 0 && ` (+${formatCurrency(customization.price)})`}
                  </p>
                ))}
              </div>
            )}
            
            {item.specialInstructions && (
              <p className="text-xs text-gray-500 italic mt-1">
                Note: {item.specialInstructions}
              </p>
            )}
          </div>

          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(item.itemTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}