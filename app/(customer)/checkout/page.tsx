'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PaymentMethod } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Banknote, Smartphone, Loader2 } from 'lucide-react';
import { CheckoutItem } from '@/components/checkout/CheckoutItem';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';
import { useCart } from '@/lib/hooks/use-cart';
import { orderService } from '@/lib/services/order.service';
import { useQueryClient } from '@tanstack/react-query';

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { items, subtotal, taxAmount, total, canCheckout } = useCart();
  
  // Form state
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MOCK');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add items to your cart before checking out</p>
        <Button asChild className="bg-red-500 hover:bg-red-600">
          <Link href="/">Browse Menu</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCheckout) {
      toast.error('Some items in your cart are unavailable');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creating order...');
      
      // Create order
      const order = await orderService.createOrder({
        phone: phone || undefined,
        email: email || undefined,
        name: name || undefined,
        specialInstructions: specialInstructions || undefined,
      });

      console.log('Order created:', order);

      // Process payment
      console.log('Processing payment...');
      const payment = await orderService.processPayment({
        orderId: order.id,
        amount: order.totalAmount,
        paymentMethod,
      });

      console.log('Payment processed:', payment);

      if (payment.status === 'SUCCESS') {
        // Show success
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        toast.success('Order placed successfully!', {
          description: `Order #${order.orderNumber}`,
        });

        // Redirect to order tracking
        router.push(`/orders/${order.orderNumber}`);
      } else {
        throw new Error('Payment failed');
      }

    } catch (error: unknown) {
      console.error('Order creation failed:', error);
      toast.error('Failed to place order', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <p className="text-sm text-gray-600 mb-4">
                Optional - Provide your details to track your order
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    pattern="[0-9]{10,15}"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
              <Textarea
                placeholder="Any special requests for your order..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={4}
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              >
                <div className="space-y-3">
                  {/* Mock - Recommended for testing */}
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 has-checked:border-green-500 has-checked:bg-green-50">
                    <RadioGroupItem value="MOCK" id="mock" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Mock Payment</p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Recommended</span>
                      </div>
                      <p className="text-sm text-gray-500">Always succeeds - Best for demo</p>
                    </div>
                  </label>

                  {/* Card */}
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 has-checked:border-red-500 has-checked:bg-red-50">
                    <RadioGroupItem value="CARD" id="card" />
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">95% success rate (simulated)</p>
                    </div>
                  </label>

                  {/* Cash */}
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 has-checked:border-red-500 has-checked:bg-red-50">
                    <RadioGroupItem value="CASH" id="cash" />
                    <Banknote className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive</p>
                    </div>
                  </label>

                  {/* UPI */}
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 has-checked:border-red-500 has-checked:bg-red-50">
                    <RadioGroupItem value="UPI" id="upi" />
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">UPI</p>
                      <p className="text-sm text-gray-500">Pay via UPI apps</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4 max-h-75 overflow-y-auto">
                {items.map((item) => (
                  <CheckoutItem key={item.id} item={item} />
                ))}
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Place Order Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !canCheckout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-6 text-lg"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order · ${formatCurrency(total)}`
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}