'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/ui-store';
import { useCart } from '@/lib/hooks/use-cart';

export function CartDrawer() {
  const router = useRouter();
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { items, summary, isLoading } = useCart();

  const handleCheckout = () => {
    closeCartDrawer();
    router.push('/checkout');
  };

  return (
    <Sheet open={isCartDrawerOpen} onOpenChange={closeCartDrawer}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-gray-200">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5" />
             Your Cart ({summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}, {summary.totalQuantity} total)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Add items from the menu to get started
            </p>
            <Button onClick={closeCartDrawer} className="bg-red-500 hover:bg-red-600">
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-2">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
              <CartSummary summary={summary} />

              <Button 
                className="w-full" 
                size="lg"
                disabled={!summary.canCheckout || isLoading}
                onClick={handleCheckout}
            >
                Proceed to Checkout
            </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}