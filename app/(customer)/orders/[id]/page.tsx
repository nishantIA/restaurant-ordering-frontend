'use client';

import { useParams } from 'next/navigation';
import { useOrderTracking } from '@/lib/hooks/use-order-tracking';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorDisplay } from '@/components/shared/ErrorDisplay';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';
import { useOrder } from '@/lib/hooks/use-order';
import { OrderStatusDisplay } from '@/components/orders/OrderStatus';
import { OrderItemComponent } from '@/components/orders/OrderItem';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderNumber = params.id as string;
  
  // Fetch order data (no polling)
  const { data: order, isLoading, error } = useOrder(orderNumber, false);
  
  // Enable real-time WebSocket updates
  const { isConnected } = useOrderTracking(order?.id || null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading order..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ErrorDisplay 
          error={error} 
          title='Unable to load order'
        />
        <div className="text-center mt-6">
          <Link href="/">
            <Button className="bg-red-500 hover:bg-red-600">Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h1>
              <p className="text-gray-600">Order #{order.orderNumber}</p>
              {order.user && (
                <p className="text-sm text-gray-500 mt-1">
                  {order.user.name && `${order.user.name} • `}
                  {order.user.phone || order.user.email}
                </p>
              )}
            </div>
          </div>
          
          {/* WebSocket Connection Status */}
          <Badge 
            variant={isConnected ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3" />
                Live
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                Offline
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Status</h2>
        <OrderStatusDisplay 
          status={order.status} 
          estimatedPrepTime={order.estimatedPrepTime}
        />
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
        
        <div className="space-y-4">
          {order.items.map((item) => (
            <OrderItemComponent key={item.id} item={item} />
          ))}
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm font-medium text-gray-700">Special Instructions:</p>
            <p className="text-sm text-gray-600">{order.specialInstructions}</p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(order.subtotal)}</span>
          </div>

          {order.taxes.map((tax, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {tax.taxName} ({tax.taxType === 'PERCENTAGE' ? `${tax.taxValue}%` : formatCurrency(tax.taxValue)})
              </span>
              <span className="font-medium">{formatCurrency(tax.calculatedAmount)}</span>
            </div>
          ))}
          
          <Separator className="my-2" />
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-red-600">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Order placed on {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline" size="lg">
            Back to Menu
          </Button>
        </Link>
      </div>
    </div>
  );
}