import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface DietaryFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
];

export function DietaryFilter({ selectedTags, onTagsChange }: DietaryFilterProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-3">
      <Label>Dietary Preferences</Label>
      <div className="flex flex-wrap gap-2">
        {DIETARY_OPTIONS.map(({ value, label, icon }) => (
          <Badge
            key={value}
            variant={selectedTags.includes(value) ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => toggleTag(value)}
          >
            <span className="mr-1">{icon}</span>
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}