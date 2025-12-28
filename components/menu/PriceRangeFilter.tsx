import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

export function PriceRangeFilter({ minPrice, maxPrice, onPriceChange }: PriceRangeFilterProps) {
  const [range, setRange] = useState([minPrice, maxPrice]);

  const handleChange = (values: number[]) => {
    setRange(values);
    onPriceChange(values[0], values[1]);
  };

  return (
    <div className="space-y-4">
      <Label>Price Range</Label>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">${range[0]}</span>
        <Slider
          min={0}
          max={50}
          step={1}
          value={range}
          onValueChange={handleChange}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground">${range[1]}</span>
      </div>
    </div>
  );
}