'use client';

import type { OrderItem } from '@/types/order';
import { formatCurrency } from '@/lib/utils/format';

interface OrderItemComponentProps {
  item: OrderItem;
}

export function OrderItemComponent({ item }: OrderItemComponentProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900">{item.itemName}</h4>
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

          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(item.itemTotal)}
            </p>
            <p className="text-xs text-gray-500">
              {formatCurrency(item.itemBasePrice)} × {item.quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}