import { ChefHat, Package, CheckCircle, XCircle } from 'lucide-react';
import type { Order, OrderStatus } from '@/types/order';
import type { LucideIcon } from 'lucide-react';

interface OrderQuickActionsProps {
  order: Order;
  onStatusUpdate: (status: OrderStatus) => void;
  isUpdating?: boolean;
}

export function OrderQuickActions({ order, onStatusUpdate, isUpdating }: OrderQuickActionsProps) {
  // Determine available quick actions based on current status
  const quickActions = getQuickActions(order.status);

  if (quickActions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
      {quickActions.map(action => {
        const Icon = action.icon;
        return (
          <button
            key={action.status}
            onClick={() => onStatusUpdate(action.status)}
            disabled={isUpdating}
            className={`flex-1 min-w-40 px-3 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${action.className}`}
          >
            <Icon className="w-4 h-4" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

interface QuickAction {
  status: OrderStatus;
  label: string;
  icon: LucideIcon;
  className: string;
}

function getQuickActions(currentStatus: OrderStatus): QuickAction[] {
  switch (currentStatus) {
    case 'RECEIVED':
      return [
        {
          status: 'PREPARING',
          label: 'Start Preparing',
          icon: ChefHat,
          className: 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm',
        },
        {
          status: 'CANCELLED',
          label: 'Cancel',
          icon: XCircle,
          className: 'bg-white text-red-600 border-2 border-red-200 hover:bg-red-50',
        },
      ];
    
    case 'PREPARING':
      return [
        {
          status: 'READY',
          label: 'Mark Ready',
          icon: Package,
          className: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
        },
        {
          status: 'CANCELLED',
          label: 'Cancel',
          icon: XCircle,
          className: 'bg-white text-red-600 border-2 border-red-200 hover:bg-red-50',
        },
      ];
    
    case 'READY':
      return [
        {
          status: 'COMPLETED',
          label: 'Complete Order',
          icon: CheckCircle,
          className: 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm',
        },
        {
          status: 'CANCELLED',
          label: 'Cancel',
          icon: XCircle,
          className: 'bg-white text-red-600 border-2 border-red-200 hover:bg-red-50',
        },
      ];
    
    default:
      return [];
  }
}