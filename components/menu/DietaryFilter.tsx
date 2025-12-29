'use client';

interface DietaryFilterProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

const OPTIONS = [
  { value: 'vegetarian', label: '🥗 Vegetarian' },
  { value: 'vegan', label: '🌱 Vegan' },
  { value: 'gluten-free', label: '🌾 Gluten-Free' },
];

export function DietaryFilter({ selected, onChange }: DietaryFilterProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => toggle(option.value)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
            selected.includes(option.value)
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:bg-orange-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}