
import { ItemDetailModal } from '@/components/menu/ItemDetailModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CustomerHeader } from '@/components/shared/Header';


export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader />
      <main className="container mx-auto px-4 py-6">{children}</main>
      
      {/* Global Modals & Drawers */}
      <ItemDetailModal />
      <CartDrawer />
    </div>
  );
}