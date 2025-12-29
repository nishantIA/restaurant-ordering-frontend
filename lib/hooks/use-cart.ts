import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/lib/services/cart.service';
import { getOrCreateSessionId } from '@/lib/utils/session';
import { ApiError } from '@/lib/api/client';
import type { 
  Cart, 
  AddCartItemRequest, 
  UpdateCartItemRequest,
  CartSummary,
} from '@/types/cart';
import { toast } from 'sonner';

export function useCart() {
  const queryClient = useQueryClient();
  const sessionId = getOrCreateSessionId();

  // Get cart
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery<Cart>({
    queryKey: ['cart', sessionId],
    queryFn: () => cartService.getCart(),
    staleTime: 0,
    refetchOnMount: true,
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: (data: AddCartItemRequest) => cartService.addItem(data),
    onSuccess: (newCart) => {
      queryClient.setQueryData<Cart>(['cart', sessionId], newCart);
      toast.success('Item added to cart');
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError 
        ? error.getUserMessage() 
        : 'Failed to add item to cart';
      toast.error(message);
    },
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemRequest }) =>
      cartService.updateItem(itemId, data),
    onSuccess: (newCart) => {
      queryClient.setQueryData<Cart>(['cart', sessionId], newCart);
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError 
        ? error.getUserMessage() 
        : 'Failed to update cart';
      toast.error(message);
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: (newCart) => {
      queryClient.setQueryData<Cart>(['cart', sessionId], newCart);
      toast.success('Item removed from cart');
    },
    onError: (error: Error) => {
      const message = error instanceof ApiError 
        ? error.getUserMessage() 
        : 'Failed to remove item';
      toast.error(message);
    },
  });

  // Helper for quantity updates
  const updateQuantity = (itemId: string, quantity: number) => {
    updateItemMutation.mutate({ itemId, data: { quantity } });
  };

  // Computed summary
  const summary: CartSummary = {
    itemCount: cart?.items.length || 0,      // Number of unique items
    totalQuantity: cart?.itemCount || 0,     // Total quantity
    subtotal: cart?.subtotal || 0,
    taxAmount: cart?.taxAmount || 0,
    total: cart?.total || 0,
    canCheckout: cart?.canCheckout || false,
  };

  return {
    // Raw data
    cart,
    items: cart?.items || [],
    
    // Summary
    summary,
    
    // Individual fields (for convenience)
    itemCount: summary.itemCount,            // Unique items
    totalQuantity: summary.totalQuantity,    // Total qty
    subtotal: summary.subtotal,
    taxAmount: summary.taxAmount,
    total: summary.total,
    canCheckout: summary.canCheckout,
    
    // States
    isLoading,
    error,
    
    // Actions
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    updateQuantity,
    removeItem: removeItemMutation.mutate,
    
    // Mutation states
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isRemoving: removeItemMutation.isPending,
  };
}