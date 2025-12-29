'use client';

import { CustomizationNode } from '@/types/menu';
import { formatCurrency } from '@/lib/utils/format';
import { AlertCircle } from 'lucide-react';

interface DAGCustomizationSelectorProps {
  nodes: CustomizationNode[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function DAGCustomizationSelector({
  nodes,
  selectedIds,
  onChange,
}: DAGCustomizationSelectorProps) {
  // Get root nodes (groups without parents)
  const rootNodes = nodes.filter((node) => node.type === 'GROUP');

  // Calculate validation error (NO useState!)
  const getValidationError = (group: CustomizationNode): string | null => {
    if (!group.children) return null;

    const selectedInGroup = selectedIds.filter((id) =>
      group.children!.some((child) => child.id === id)
    );

    const min = group.constraints?.min || 0;
    const max = group.constraints?.max || group.children.length;
    const required = group.constraints?.required || false;

    if (required && selectedInGroup.length < min) {
      return `Please select at least ${min}`;
    }

    if (selectedInGroup.length > max) {
      return `Maximum ${max} selection(s) allowed`;
    }

    return null;
  };

  const handleToggle = (group: CustomizationNode, optionId: string) => {
    if (!group.children) return;

    const max = group.constraints?.max || group.children.length;
    const selectedInGroup = selectedIds.filter((id) =>
      group.children!.some((child) => child.id === id)
    );

    let newSelectedIds: string[];

    if (max === 1) {
      //  RADIO BEHAVIOR - Always replace selection
      newSelectedIds = [
        ...selectedIds.filter((id) => !group.children!.some((child) => child.id === id)),
        optionId,
      ];
    } else {
      //  CHECKBOX BEHAVIOR - Toggle on/off
      const isSelected = selectedIds.includes(optionId);
      
      if (isSelected) {
        newSelectedIds = selectedIds.filter((id) => id !== optionId);
      } else {
        if (selectedInGroup.length >= max) return;
        newSelectedIds = [...selectedIds, optionId];
      }
    }

    onChange(newSelectedIds);
  };

  const getGroupDescription = (group: CustomizationNode): string => {
    if (!group.children) return '';

    const min = group.constraints?.min || 0;
    const max = group.constraints?.max || group.children.length;
    const required = group.constraints?.required || false;

    if (max === 1) {
      return required ? 'Choose 1' : 'Choose 1 (optional)';
    }
    if (min === max) {
      return `Choose exactly ${min}`;
    }
    if (min > 0) {
      return `Choose ${min}-${max}`;
    }
    return `Choose up to ${max}`;
  };

  return (
    <div className="space-y-6">
      {rootNodes
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((group) => {
          if (!group.children || group.children.length === 0) return null;

          const max = group.constraints?.max || group.children.length;
          const required = group.constraints?.required || false;
          const selectedInGroup = selectedIds.filter((id) =>
            group.children!.some((child) => child.id === id)
          );
          const isRadio = max === 1;
          const validationError = getValidationError(group);

          return (
            <div key={group.id} className="space-y-3">
              {/* Group Header */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-base">
                    {group.name}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {getGroupDescription(group)}
                  </span>
                </div>
                {group.description && (
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                )}
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
                {group.children
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((option) => {
                    const isSelected = selectedIds.includes(option.id);
                    const isDisabled = 
                      !isRadio && // Only disable for checkboxes
                      !isSelected && 
                      selectedInGroup.length >= max;

                    return (
                      <label
                        key={option.id}
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
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type={isRadio ? 'radio' : 'checkbox'}
                            name={isRadio ? `group-${group.id}` : undefined}
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={() => handleToggle(group, option.id)}
                            className="h-4 w-4 accent-orange-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{option.name}</div>
                            {option.description && (
                              <div className="text-sm text-muted-foreground">
                                {option.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {option.price > 0 && (
                          <span className="text-sm font-semibold text-orange-600">
                            +{formatCurrency(option.price)}
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
export function validateDAGCustomizations(
  nodes: CustomizationNode[],
  selectedIds: string[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const rootNodes = nodes.filter((node) => node.type === 'GROUP');

  rootNodes.forEach((group) => {
    if (!group.children) return;

    const selectedInGroup = selectedIds.filter((id) =>
      group.children!.some((child) => child.id === id)
    );

    const min = group.constraints?.min || 0;
    const max = group.constraints?.max || group.children.length;
    const required = group.constraints?.required || false;

    if (required && selectedInGroup.length < min) {
      errors.push(`Please select ${group.name.toLowerCase()}`);
    }

    if (selectedInGroup.length > max) {
      errors.push(`Too many selections for ${group.name.toLowerCase()}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}