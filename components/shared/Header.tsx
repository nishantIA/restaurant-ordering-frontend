'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/lib/stores/ui-store';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

/**
 * Cart Response Type
 */
interface CartResponse {
  itemCount: number;
  items: unknown[];
  summary: {
    subtotal: number;
    taxAmount: number;
    total: number;
  };
}

/**
 * Fetch cart for item count
 */
async function fetchCart(): Promise<CartResponse | null> {
  try {
    return await apiClient.get<CartResponse>('/cart');
  } catch (error) {
    console.log(error)
    return null;
  }
}

export function Header() {
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  // Get cart for item count
  const { data: cart } = useQuery<CartResponse | null>({
    queryKey: ['cart'],
    queryFn: fetchCart,
    staleTime: 0,
  });

  const itemCount = cart?.itemCount || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">🍽️ Restaurant</span>
        </Link>

        {/* Cart Button */}
        <Button
          variant="outline"
          size="sm"
          className="relative"
          onClick={openCartDrawer}
        >
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {itemCount}
            </Badge>
          )}
          <span className="ml-2 hidden sm:inline">Cart</span>
        </Button>
      </div>
    </header>
  );
}