/**
 * Customer Layout
 * Wraps all customer-facing pages with Header and modals
 */

import { Header } from '@/components/shared/Header';
import { ItemDetailModal } from '@/components/menu/ItemDetailModal';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">{children}</main>
      
      {/* Global Modals */}
      <ItemDetailModal />
    </div>
  );
}