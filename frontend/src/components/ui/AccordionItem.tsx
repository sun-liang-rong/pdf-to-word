'use client';

import { ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';

interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

export function AccordionItem({
  title,
  children,
  isOpen,
  onToggle,
  className = '',
  size = 'md',
  icon,
}: AccordionItemProps) {
  const sizeClasses = {
    sm: {
      container: 'px-3 py-2',
      title: 'text-sm',
      content: 'px-3 pb-3 text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      container: 'px-4 py-3',
      title: 'text-base',
      content: 'px-4 pb-4 text-base',
      icon: 'w-5 h-5',
    },
    lg: {
      container: 'px-6 py-4',
      title: 'text-lg',
      content: 'px-6 pb-6 text-lg',
      icon: 'w-6 h-6',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`border rounded-xl overflow-hidden ${className}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between ${currentSize.container} bg-white/5 hover:bg-white/10 transition-colors`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon && <span className={currentSize.icon}>{icon}</span>}
          <span className={`font-medium ${currentSize.title} text-white`}>{title}</span>
        </div>
        <ChevronDown
          className={`${currentSize.icon} text-primary-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`${currentSize.content} text-foreground-muted pt-2 font-medium`}>{children}</div>
      </div>
    </div>
  );
}
