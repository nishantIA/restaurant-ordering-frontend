'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import type { Order, OrderStatus } from '@/types/order';
import { useUpdateOrderStatus } from '@/lib/hooks/use-kitchen-orders-query';

interface StatusUpdateDialogProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
  RECEIVED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

const statusLabels: Record<OrderStatus, string> = {
  RECEIVED: 'Received',
  PREPARING: 'Preparing',
  READY: 'Ready for Pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusColors: Record<OrderStatus, string> = {
  RECEIVED: 'bg-blue-600 hover:bg-blue-700',
  PREPARING: 'bg-orange-600 hover:bg-orange-700',
  READY: 'bg-green-600 hover:bg-green-700',
  COMPLETED: 'bg-gray-600 hover:bg-gray-700',
  CANCELLED: 'bg-red-600 hover:bg-red-700',
};

export function StatusUpdateDialog({ order, isOpen, onClose }: StatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [notes, setNotes] = useState('');
  const updateMutation = useUpdateOrderStatus();

  const availableStatuses = statusTransitions[order.status];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStatus) return;

    updateMutation.mutate(
      {
        orderId: order.id,
        data: {
          status: selectedStatus,
          notes: notes.trim() || undefined,
          changedBy: 'Kitchen Staff',
        },
      },
      {
        onSuccess: () => {
          onClose();
          setSelectedStatus(null);
          setNotes('');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Update Order Status
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Order Number</div>
            <div className="text-lg font-bold text-gray-900">{order.orderNumber}</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Status Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              {availableStatuses.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No status changes available for {statusLabels[order.status]} orders.
                </p>
              ) : (
                <div className="space-y-2">
                  {availableStatuses.map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedStatus === status
                          ? `${statusColors[status]} text-white shadow-md`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={updateMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedStatus || updateMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}