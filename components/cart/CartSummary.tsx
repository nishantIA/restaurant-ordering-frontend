'use client';

import type { CartSummary } from '@/types/cart';

interface CartSummaryProps {
  summary: CartSummary;
}

export function CartSummary({ summary }: CartSummaryProps) {
  const { subtotal, taxAmount, total } = summary;
  return (
    <div className="space-y-2 py-4 border-t border-gray-200">
      {/* Subtotal */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>

      {/* Tax */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Tax (18%)</span>
        <span className="font-medium">${taxAmount.toFixed(2)}</span>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-gray-200">
        <span>Total</span>
        <span className="text-red-600">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}