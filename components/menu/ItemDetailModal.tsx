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
import { Clock, Minus, Plus, ShoppingCart, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { MenuItem } from '@/types/menu';
import { useCart } from '@/lib/hooks/use-cart';
import {
  SimpleCustomizationSelector,
  validateSimpleCustomizations,
} from './SimpleCustomizationSelector';
import {
  DAGCustomizationSelector,
  validateDAGCustomizations,
} from './DAGCustomizationSelector';

export function ItemDetailModal() {
  const { isItemModalOpen, selectedItemId, closeItemModal } = useUIStore();
  const { data: item, isLoading, error } = useMenuItem(selectedItemId || '');

  return (
    <Dialog open={isItemModalOpen} onOpenChange={closeItemModal}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        key={selectedItemId}
      >
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading item details..." />
          </div>
        )}

        {error && !isLoading && <ErrorDisplay error={error} />}

        {item && !isLoading && <ItemDetailContent item={item} />}
      </DialogContent>
    </Dialog>
  );
}

interface ItemDetailContentProps {
  item: MenuItem;
}

function ItemDetailContent({ item }: ItemDetailContentProps) {
  const { addItem, isAdding } = useCart();
  const { closeItemModal, openCartDrawer } = useUIStore();

  const [quantity, setQuantity] = useState(item.minQuantity);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta * item.stepQuantity;
    if (newQuantity < item.minQuantity) return;
    if (item.maxQuantity != null && newQuantity > item.maxQuantity) return;
    setQuantity(newQuantity);
  };

  const calculateTotal = (): number => {
    let total = item.basePrice;

    // SIMPLE customizations
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

    // DAG customizations
    if (item.customizationType === 'COMPLEX_DAG' && item.dagCustomizations) {
      selectedCustomizations.forEach((nodeId) => {
        // Find node in the tree
        const findNode = (nodes: typeof item.dagCustomizations): typeof item.dagCustomizations[number] | null => {
          for (const node of nodes || []) {
            if (node.id === nodeId) return node;
            if (node.children) {
              const found = findNode(node.children);
              if (found) return found;
            }
          }
          return null;
        };

        const node = item.dagCustomizations ? findNode(item.dagCustomizations) : null;
        if (node) {
          total += node.price;
        }
      });
    }

    return total * quantity;
  };

  const canAddToCart = (): boolean => {
    // Check availability
    if (!item.isAvailable) return false;

    // Validate customizations
    if (item.customizationType === 'SIMPLE' && item.simpleCustomizations) {
      const validation = validateSimpleCustomizations(
        item.simpleCustomizations,
        selectedCustomizations
      );
      setValidationErrors(validation.errors);
      return validation.isValid;
    }

    if (item.customizationType === 'COMPLEX_DAG' && item.dagCustomizations) {
      const validation = validateDAGCustomizations(
        item.dagCustomizations,
        selectedCustomizations
      );
      setValidationErrors(validation.errors);
      return validation.isValid;
    }

    setValidationErrors([]);
    return true;
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) return;

    addItem(
      {
        menuItemId: item.id,
        quantity,
        customizations:
          selectedCustomizations.length > 0
            ? selectedCustomizations.map((id) => ({ customizationId: id }))
            : undefined,
        specialInstructions: specialInstructions || undefined,
      },
      {
        onSuccess: () => {
          closeItemModal();
          openCartDrawer();
          setQuantity(item.minQuantity);
          setSelectedCustomizations([]);
          setSpecialInstructions('');
          setValidationErrors([]);
        },
      }
    );
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
        {item.description && <p className="text-muted-foreground">{item.description}</p>}

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
            <span className="text-muted-foreground">{item.allergens.join(', ')}</span>
          </div>
        )}

        <Separator />

        {/* SIMPLE Customizations */}
        {item.customizationType === 'SIMPLE' &&
          item.simpleCustomizations &&
          item.simpleCustomizations.length > 0 && (
            <>
              <div>
                <h3 className="font-semibold text-lg mb-3">Customize Your Order</h3>
                <SimpleCustomizationSelector
                  customizations={item.simpleCustomizations}
                  selectedIds={selectedCustomizations}
                  onChange={setSelectedCustomizations}
                />
              </div>
              <Separator />
            </>
          )}

        {/* DAG Customizations */}
        {item.customizationType === 'COMPLEX_DAG' &&
          item.dagCustomizations &&
          item.dagCustomizations.length > 0 && (
            <>
              <div>
                <h3 className="font-semibold text-lg mb-3">Build Your Order</h3>
                <DAGCustomizationSelector
                  nodes={item.dagCustomizations}
                  selectedIds={selectedCustomizations}
                  onChange={setSelectedCustomizations}
                />
              </div>
              <Separator />
            </>
          )}

        {/* Special Instructions */}
        <div className="space-y-2">
          <label htmlFor="special-instructions" className="text-sm font-medium">
            Special Instructions (Optional)
          </label>
          <textarea
            id="special-instructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g., Extra spicy, no onions..."
            className="w-full min-h-20 px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

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
            <span className="text-xl font-semibold min-w-20 text-center">
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

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            {validationErrors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ))}
          </div>
        )}
      </div>

      <DialogFooter className="flex items-center justify-between sm:justify-between">
        <div className="text-2xl font-bold">{formatCurrency(calculateTotal())}</div>
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!item.isAvailable || isAdding}
          className="bg-red-500 hover:bg-red-600"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </DialogFooter>
    </>
  );
}