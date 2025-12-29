'use client';

import { CheckCircle2, Clock, ChefHat, Package, XCircle } from 'lucide-react';
import type { OrderStatus } from '@/types/order';

const statusConfig = {
  RECEIVED: {
    label: 'Order Received',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  PREPARING: {
    label: 'Preparing',
    icon: ChefHat,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  READY: {
    label: 'Ready for Pickup',
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

interface OrderStatusProps {
  status: OrderStatus;
  estimatedPrepTime?: number;
}

export function OrderStatusDisplay({ status, estimatedPrepTime }: OrderStatusProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <StatusIcon className={`h-12 w-12 ${config.color}`} />
      <div>
        <p className={`text-xl font-bold ${config.color}`}>
          {config.label}
        </p>
        {estimatedPrepTime && status !== 'COMPLETED' && status !== 'CANCELLED' && (
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Clock className="h-4 w-4" />
            Est. {estimatedPrepTime} minutes
          </p>
        )}
      </div>
    </div>
  );
}