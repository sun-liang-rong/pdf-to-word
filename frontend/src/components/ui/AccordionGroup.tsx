'use client';

import { useState, ReactNode } from 'react';
import { AccordionItem } from './AccordionItem';

export interface AccordionItemData {
  title: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  id?: string;
}

interface AccordionGroupProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultOpen?: number | number[];
  onItemToggle?: (index: number, isOpen: boolean) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  itemClassName?: string;
}

export function AccordionGroup({
  items,
  allowMultiple = false,
  defaultOpen = 0,
  onItemToggle,
  className = '',
  size = 'md',
  itemClassName = '',
}: AccordionGroupProps) {
  const [openIndices, setOpenIndices] = useState<number[]>(() => {
    if (Array.isArray(defaultOpen)) {
      return defaultOpen;
    }
    return typeof defaultOpen === 'number' ? [defaultOpen] : [];
  });

  const handleToggle = (index: number) => {
    const isOpen = openIndices.includes(index);
    
    let newOpenIndices: number[];
    if (allowMultiple) {
      newOpenIndices = isOpen
        ? openIndices.filter((i) => i !== index)
        : [...openIndices, index];
    } else {
      newOpenIndices = isOpen ? [] : [index];
    }

    setOpenIndices(newOpenIndices);
    onItemToggle?.(index, !isOpen);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id || index}
          title={item.title}
          icon={item.icon}
          isOpen={openIndices.includes(index)}
          onToggle={() => handleToggle(index)}
          className={itemClassName}
          size={size}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
