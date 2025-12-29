import { Clock, Users, AlertCircle, MoreVertical } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderQuickActions } from './OrderQuickActions';
import type { Order, OrderStatus } from '@/types/order';

interface OrderCardProps {
  order: Order;
  onStatusUpdate?: (order: Order, status: OrderStatus) => void;
  onViewDetails?: (order: Order) => void;
  isUpdating?: boolean;
}

export function OrderCard({ order, onStatusUpdate, onViewDetails, isUpdating }: OrderCardProps) {
  const createdAt = new Date(order.createdAt);
  const timeAgo = getTimeAgo(createdAt);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all relative">
      {/* Updating Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center z-10">
          <div className="text-sm font-medium text-gray-600">Updating...</div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">
              {order.orderNumber}
            </h3>
            {order.estimatedPrepTime && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                ~{order.estimatedPrepTime}min
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{timeAgo}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(order)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Customer Info */}
      {order.user && (
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <Users className="w-4 h-4" />
          <span className="font-medium">
            {order.user.name || order.user.phone || order.user.email}
          </span>
        </div>
      )}

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="text-sm">
            <div>
              <span className="font-semibold text-gray-900">{item.quantity}x</span>{' '}
              <span className="text-gray-700">{item.itemName}</span>
            </div>
            {item.customizations.length > 0 && (
              <div className="ml-6 text-xs text-gray-500 mt-0.5">
                + {item.customizations.map(c => c.name).join(', ')}
              </div>
            )}
            {item.specialInstructions && (
              <div className="ml-6 text-xs text-orange-600 italic mt-0.5">
                ⚠️ {item.specialInstructions}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Special Instructions */}
      {order.specialInstructions && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-medium text-yellow-800 mb-1">Order Note</div>
              <p className="text-sm text-yellow-900">{order.specialInstructions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Total */}
      <div className="flex items-center justify-between pb-4">
        <div className="text-sm">
          <span className="text-gray-500">Total:</span>{' '}
          <span className="font-bold text-gray-900 text-lg">${order.totalAmount.toFixed(2)}</span>
        </div>
        <div className="text-xs text-gray-500">
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Quick Actions */}
      {onStatusUpdate && (
        <OrderQuickActions
          order={order}
          onStatusUpdate={(status) => onStatusUpdate(order, status)}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}