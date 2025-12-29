'use client';

import { SimpleCustomization } from '@/types/menu';
import { formatCurrency } from '@/lib/utils/format';
import { AlertCircle } from 'lucide-react';

interface SimpleCustomizationSelectorProps {
  customizations: SimpleCustomization[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

interface CustomizationGroup {
  type: string;
  items: SimpleCustomization[];
  minSelections: number;
  maxSelections: number;
  isRequired: boolean;
}

export function SimpleCustomizationSelector({
  customizations,
  selectedIds,
  onChange,
}: SimpleCustomizationSelectorProps) {
  // Group customizations by type
  const groups = customizations.reduce((acc, customization) => {
    const type = customization.type;
    if (!acc[type]) {
      acc[type] = {
        type,
        items: [],
        minSelections: customization.minSelections,
        maxSelections: customization.maxSelections,
        isRequired: customization.isRequired,
      };
    }
    acc[type].items.push(customization);
    return acc;
  }, {} as Record<string, CustomizationGroup>);

  // Sort groups: SIZE first, then others
  const sortedGroups = Object.values(groups).sort((a, b) => {
    const order = ['SIZE', 'ADDON', 'MODIFIER', 'OPTION'];
    return order.indexOf(a.type) - order.indexOf(b.type);
  });

  // Calculate validation errors (NO useState!)
  const getValidationError = (group: CustomizationGroup): string | null => {
    const selectedInGroup = selectedIds.filter((id) =>
      group.items.some((item) => item.id === id)
    );

    if (group.isRequired && selectedInGroup.length < group.minSelections) {
      return `Please select at least ${group.minSelections}`;
    }

    if (selectedInGroup.length > group.maxSelections) {
      return `Maximum ${group.maxSelections} selection(s) allowed`;
    }

    return null;
  };

  const handleToggle = (group: CustomizationGroup, customizationId: string) => {
    const selectedInGroup = selectedIds.filter((id) =>
      group.items.some((item) => item.id === id)
    );

    let newSelectedIds: string[];

    if (group.maxSelections === 1) {
      //  RADIO BEHAVIOR - Always replace selection
      // Remove all from this group, add the clicked one
      newSelectedIds = [
        ...selectedIds.filter((id) => !group.items.some((item) => item.id === id)),
        customizationId,
      ];
    } else {
      //  CHECKBOX BEHAVIOR - Toggle on/off
      const isSelected = selectedIds.includes(customizationId);
      
      if (isSelected) {
        // Remove it
        newSelectedIds = selectedIds.filter((id) => id !== customizationId);
      } else {
        // Add it (if not at max)
        if (selectedInGroup.length >= group.maxSelections) {
          return; // Max limit reached
        }
        newSelectedIds = [...selectedIds, customizationId];
      }
    }

    onChange(newSelectedIds);
  };

  const getGroupLabel = (type: string): string => {
    const labels: Record<string, string> = {
      SIZE: 'Size',
      ADDON: 'Add-ons',
      MODIFIER: 'Preferences',
      OPTION: 'Options',
    };
    return labels[type] || type;
  };

  const getGroupDescription = (group: CustomizationGroup): string => {
    if (group.maxSelections === 1) {
      return group.isRequired ? 'Choose 1' : 'Choose 1 (optional)';
    }
    if (group.minSelections === group.maxSelections) {
      return `Choose exactly ${group.minSelections}`;
    }
    if (group.minSelections > 0) {
      return `Choose ${group.minSelections}-${group.maxSelections}`;
    }
    return `Choose up to ${group.maxSelections}`;
  };

  return (
    <div className="space-y-6">
      {sortedGroups.map((group) => {
        const selectedInGroup = selectedIds.filter((id) =>
          group.items.some((item) => item.id === id)
        );
        const isRadio = group.maxSelections === 1;
        const validationError = getValidationError(group);

        return (
          <div key={group.type} className="space-y-3">
            {/* Group Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">
                {getGroupLabel(group.type)}
                {group.isRequired && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <span className="text-sm text-muted-foreground">
                {getGroupDescription(group)}
              </span>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {validationError}
              </div>
            )}

            {/* Options */}
            <div className="space-y-2">
              {group.items
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((customization) => {
                  const isSelected = selectedIds.includes(customization.id);
                  const isDisabled =
                    !isRadio && // Only disable for checkboxes
                    !isSelected &&
                    selectedInGroup.length >= group.maxSelections;

                  return (
                    <label
                      key={customization.id}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                        isDisabled
                          ? 'cursor-not-allowed opacity-60 bg-gray-50'
                          : 'cursor-pointer'
                      } ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type={isRadio ? 'radio' : 'checkbox'}
                          name={isRadio ? `group-${group.type}` : undefined}
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={() => handleToggle(group, customization.id)}
                          className="h-4 w-4 accent-orange-500"
                        />
                        <span className="font-medium">{customization.name}</span>
                      </div>
                      {customization.price > 0 && (
                        <span className="text-sm font-semibold text-orange-600">
                          +{formatCurrency(customization.price)}
                        </span>
                      )}
                    </label>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Export validation function
export function validateSimpleCustomizations(
  customizations: SimpleCustomization[],
  selectedIds: string[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  const groups = customizations.reduce((acc, customization) => {
    const type = customization.type;
    if (!acc[type]) {
      acc[type] = {
        type,
        items: [],
        minSelections: customization.minSelections,
        maxSelections: customization.maxSelections,
        isRequired: customization.isRequired,
      };
    }
    acc[type].items.push(customization);
    return acc;
  }, {} as Record<string, CustomizationGroup>);

  Object.values(groups).forEach((group) => {
    const selectedInGroup = selectedIds.filter((id) =>
      group.items.some((item) => item.id === id)
    );

    if (group.isRequired && selectedInGroup.length < group.minSelections) {
      errors.push(`Please select ${group.type.toLowerCase()}`);
    }

    if (selectedInGroup.length > group.maxSelections) {
      errors.push(`Too many ${group.type.toLowerCase()} selections`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}