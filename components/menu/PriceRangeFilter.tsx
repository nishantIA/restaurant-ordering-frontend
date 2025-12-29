'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

import { DollarSign, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onChange: (min?: number, max?: number) => void;
}

const PRICE_PRESETS = [
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 - $20', min: 10, max: 20 },
  { label: '$20 - $30', min: 20, max: 30 },
  { label: 'Above $30', min: 30, max: undefined },
];

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState<string>(minPrice?.toString() || '');
  const [localMax, setLocalMax] = useState<string>(maxPrice?.toString() || '');
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilter = minPrice !== undefined || maxPrice !== undefined;

  const handleApply = () => {
    const min = localMin ? parseFloat(localMin) : undefined;
    const max = localMax ? parseFloat(localMax) : undefined;
    onChange(min, max);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalMin('');
    setLocalMax('');
    onChange(undefined, undefined);
    setIsOpen(false);
  };

  const handlePreset = (min: number, max?: number) => {
    setLocalMin(min.toString());
    setLocalMax(max?.toString() || '');
    onChange(min, max);
    setIsOpen(false);
  };

  const getButtonLabel = () => {
    if (!hasActiveFilter) return 'Price';
    if (minPrice && maxPrice) return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
    if (minPrice) return `From ${formatCurrency(minPrice)}`;
    if (maxPrice) return `Up to ${formatCurrency(maxPrice)}`;
    return 'Price';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasActiveFilter ? 'default' : 'outline'}
          className={hasActiveFilter ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          {getButtonLabel()}
          {hasActiveFilter && (
            <X
              className="h-3 w-3 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-3">Price Range</h4>
            
            {/* Presets */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PRICE_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(preset.min, preset.max)}
                  className="justify-start"
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Custom Range */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    placeholder="Any"
                    className="w-full pl-7 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}