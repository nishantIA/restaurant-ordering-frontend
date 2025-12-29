'use client';

import { useState } from 'react';
import { useKitchenWebSocket } from '@/lib/hooks/use-kitchen-websocket';
import { KitchenStats } from '@/components/kitchen/KitchenStats';
import { OrderCard } from '@/components/kitchen/OrderCard';
import { StatusUpdateDialog } from '@/components/kitchen/StatusUpdateDialog';
import { Loader2, WifiOff, Volume2, VolumeX, LogOut, UtensilsCrossed } from 'lucide-react';
import { toggleSound, getSoundPreference } from '@/lib/utils/notification-sound';
import type { Order, OrderStatus } from '@/types/order';
import { useKitchenOrders, useKitchenStats, useUpdateOrderStatus } from '@/lib/hooks/use-kitchen-orders-query';
import { useKitchenAuth } from '@/lib/contexts/KitchenAuthContext';
import Link from 'next/link';

type StatusFilter = 'all' | 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export default function KitchenDashboardPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated, isLoading:authLoading, logout } = useKitchenAuth();
  
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return getSoundPreference();
  });

  // WebSocket connection
  const { isConnected } = useKitchenWebSocket();
  
  // Fetch orders and stats
    const { 
    data: orders, 
    isLoading: ordersInitialLoading,
    isFetching: ordersRefetching,
  } = useKitchenOrders(statusFilter === 'all' ? undefined : statusFilter);
  
  const { 
    data: stats, 
    isLoading: statsInitialLoading 
  } = useKitchenStats();
  
  const updateMutation = useUpdateOrderStatus();

  const filteredOrders = orders?.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  }) || [];

  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Handle quick status update
  const handleQuickStatusUpdate = (order: Order, status: OrderStatus) => {
    updateMutation.mutate({
      orderId: order.id,
      data: {
        status,
        changedBy: 'Kitchen Staff',
      },
    });
  };

  // Handle view details (opens dialog)
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Toggle sound
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  };

  if (authLoading || !isAuthenticated || ordersInitialLoading || statsInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading kitchen dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
                href="/dashboard" 
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
            
            {/* Connection Status & Controls */}
            <div className="flex items-center gap-3">
              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  soundEnabled
                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
                title={soundEnabled ? 'Sound On' : 'Sound Off'}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Sound On
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Sound Off
                  </>
                )}
              </button>

              {/* Offline Warning */}
              {!isConnected && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200">
                  <WifiOff className="w-4 h-4" />
                  Offline
                </div>
              )}
              
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                isConnected 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
                {isConnected ? 'Live Updates' : 'Connecting...'}
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="mb-8">
            <KitchenStats stats={stats} />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <FilterButton
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            count={orders?.length || 0}
            variant="default"
          >
            All Orders
          </FilterButton>
          
          <FilterButton
            active={statusFilter === 'RECEIVED'}
            onClick={() => setStatusFilter('RECEIVED')}
            count={stats?.received || 0}
            variant="blue"
          >
            Received
          </FilterButton>
          
          <FilterButton
            active={statusFilter === 'PREPARING'}
            onClick={() => setStatusFilter('PREPARING')}
            count={stats?.preparing || 0}
            variant="orange"
          >
            Preparing
          </FilterButton>
          
          <FilterButton
            active={statusFilter === 'READY'}
            onClick={() => setStatusFilter('READY')}
            count={stats?.ready || 0}
            variant="green"
          >
            Ready
          </FilterButton>

          <FilterButton 
            active={statusFilter === 'COMPLETED'} 
            onClick={() => setStatusFilter('COMPLETED')} 
            count={stats?.completed || 0} 
            variant="gray"
          >
            Completed
          </FilterButton>

          <FilterButton 
            active={statusFilter === 'CANCELLED'} 
            onClick={() => setStatusFilter('CANCELLED')} 
            count={stats?.cancelled || 0} 
            variant="red"
          >
            Cancelled
          </FilterButton>
        </div>

        {/* Orders Grid */}
        <div className="relative">
          {ordersRefetching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm rounded-lg">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 shadow-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Loading...</span>
                </div>
            </div>
          )}

          {sortedOrders.length === 0 ? (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter.toLowerCase()} orders`}
              </h3>
              <p className="text-gray-500">
                {statusFilter === 'all' 
                  ? 'New orders will appear here when customers place them' 
                  : `Orders will appear here when they are marked as ${statusFilter.toLowerCase()}`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleQuickStatusUpdate}
                  onViewDetails={handleViewDetails}
                  isUpdating={updateMutation.isPending && updateMutation.variables?.orderId === order.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Update Dialog */}
      {selectedOrder && (
        <StatusUpdateDialog
          order={selectedOrder}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}

// Filter Button Component
interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  count: number;
  variant: 'default' | 'blue' | 'orange' | 'green' | 'gray' | 'red';
  children: React.ReactNode;
}

function FilterButton({ active, onClick, count, variant, children }: FilterButtonProps) {
  const variants = {
    default: active 
      ? 'bg-gray-900 text-white border-gray-900' 
      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
    blue: active 
      ? 'bg-blue-600 text-white border-blue-600' 
      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50',
    orange: active 
      ? 'bg-orange-600 text-white border-orange-600' 
      : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50',
    green: active 
      ? 'bg-green-600 text-white border-green-600' 
      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50',
    gray: active 
      ? 'bg-gray-600 text-white border-gray-600' 
      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
    red: active 
      ? 'bg-red-600 text-white border-red-600' 
      : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50',
  };

  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 cursor-pointer rounded-lg font-medium border-2 transition-colors ${variants[variant]}`}
    >
      {children} <span className={active ? 'opacity-90' : 'opacity-60'}>({count})</span>
    </button>
  );
}