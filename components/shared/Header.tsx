'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, Package, UtensilsCrossed } from 'lucide-react';
import { useCart } from '@/lib/hooks/use-cart';
import { useUIStore } from '@/lib/stores/ui-store';

export function CustomerHeader() {
  const { summary } = useCart();
  const { openCartDrawer } = useUIStore();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Restaurant Name */}
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Savory Bites</h1>
              <p className="text-xs text-gray-500">Delicious food, delivered fresh</p>
            </div>
            <h1 className="sm:hidden text-lg font-bold text-gray-900">Savory Bites</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                isActive('/')
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Menu className="w-4 h-4" />
              Menu
            </Link>

            <Link
              href="/orders"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                isActive('/orders')
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Package className="w-4 h-4" />
              Orders
            </Link>
          </nav>

          {/* Cart Button */}
          <button
            onClick={openCartDrawer} //  Use your existing function
            className="relative cursor-pointer flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Cart</span>
            {summary.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                {summary.itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-2 pb-3 border-t pt-3 mt-1">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium flex-1 justify-center transition-all ${
              isActive('/')
                ? 'text-orange-600 bg-orange-50 border border-orange-200'
                : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50 border border-transparent'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm">Menu</span>
          </Link>

          <Link
            href="/orders"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium flex-1 justify-center transition-all ${
              isActive('/orders')
                ? 'text-orange-600 bg-orange-50 border border-orange-200'
                : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50 border border-transparent'
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="text-sm">Orders</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}