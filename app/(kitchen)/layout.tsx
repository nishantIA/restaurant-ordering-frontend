import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { KitchenAuthProvider } from '@/lib/contexts/KitchenAuthContext';


export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <KitchenAuthProvider>
        {children}
      </KitchenAuthProvider>
    </ErrorBoundary>
  );
}