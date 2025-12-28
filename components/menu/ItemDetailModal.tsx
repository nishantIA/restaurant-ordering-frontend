/**
 * ItemDetailModal Component
 * Shows menu item details with customization options
 * Handles adding items to cart
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useMenuItem } from '@/lib/hooks/queries/use-menu-item';
import { useUIStore } from '@/lib/stores/ui-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorDisplay } from '@/components/shared/ErrorDisplay';
import { Clock, Minus, Plus, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { toast } from 'sonner';
import { MenuItem } from '@/types/menu';

export function ItemDetailModal() {
  const { isItemModalOpen, selectedItemId, closeItemModal } = useUIStore();
  const { data: item, isLoading, error } = useMenuItem(selectedItemId || '');

  return (
    <Dialog open={isItemModalOpen} onOpenChange={closeItemModal}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        key={selectedItemId} // Key prop forces re-mount when item changes
      >
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading item details..." />
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <ErrorDisplay error={error} />
        )}

        {/* Content */}
        {item && !isLoading && (
          <ItemDetailContent item={item} onClose={closeItemModal} />
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Separate component for item content - re-mounts when item changes
 * This avoids cascading render issues
 */
interface ItemDetailContentProps {
  item: MenuItem;
  onClose: () => void;
}

function ItemDetailContent({ item, onClose }: ItemDetailContentProps) {
  // Initialize state from item (runs only on mount)
  const [quantity, setQuantity] = useState(item.minQuantity);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta * item.stepQuantity;

    // Check min/max bounds
    if (newQuantity < item.minQuantity) return;
    if (item.maxQuantity != null && newQuantity > item.maxQuantity) return;

    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // TODO: Implement cart mutation
    toast.success(`Added ${item.name} to cart!`);
    onClose();
  };

  // Calculate total price
  const calculateTotal = (): number => {
    let total = item.basePrice;

    // Add customization prices
    if (item.customizationType === 'SIMPLE' && item.simpleCustomizations) {
      selectedCustomizations.forEach((customizationId) => {
        const customization = item.simpleCustomizations?.find(
          (c) => c.id === customizationId
        );
        if (customization) {
          total += customization.price;
        }
      });
    }

    return total * quantity;
  };

  const toggleCustomization = (customizationId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomizations([...selectedCustomizations, customizationId]);
    } else {
      setSelectedCustomizations(
        selectedCustomizations.filter((id) => id !== customizationId)
      );
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">{item.name}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Image */}
        {item.imageUrl && (
          <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p className="text-muted-foreground">{item.description}</p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-2">
          {item.prepTime && (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {item.prepTime} min
            </Badge>
          )}
          {item.dietaryTags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">Allergens: </span>
            <span className="text-muted-foreground">
              {item.allergens.join(', ')}
            </span>
          </div>
        )}

        <Separator />

        {/* Customizations (SIMPLE) */}
        {item.customizationType === 'SIMPLE' &&
          item.simpleCustomizations &&
          item.simpleCustomizations.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Customize Your Order</h3>
              <div className="space-y-2">
                {item.simpleCustomizations.map((customization) => (
                  <label
                    key={customization.id}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCustomizations.includes(customization.id)}
                        onChange={(e) => toggleCustomization(customization.id, e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span>{customization.name}</span>
                    </div>
                    {customization.price > 0 && (
                      <span className="text-sm font-medium">
                        +{formatCurrency(customization.price)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

        <Separator />

        {/* Quantity Selector */}
        <div className="space-y-3">
          <h3 className="font-semibold">Quantity</h3>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= item.minQuantity}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-semibold min-w-[60px] text-center">
              {quantity} {item.unit}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={item.maxQuantity != null && quantity >= item.maxQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter className="flex items-center justify-between sm:justify-between">
        <div className="text-2xl font-bold">
          {formatCurrency(calculateTotal())}
        </div>
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!item.isAvailable}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </DialogFooter>
    </>
  );
}