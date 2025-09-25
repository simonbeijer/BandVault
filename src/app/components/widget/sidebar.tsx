"use client";

import type { ReactNode } from 'react';

interface WidgetItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface SidebarProps {
  selectedWidget: string;
  setSelectedWidget: (widget: string) => void;
  title?: string;
  items?: WidgetItem[];
  className?: string;
  itemClassName?: string;
  selectedItemClassName?: string;
  orientation?: 'vertical' | 'horizontal';
  variant?: 'default' | 'minimal' | 'bordered';
}

const Sidebar = ({ 
  selectedWidget, 
  setSelectedWidget,
  title = "Dashboard",
  items,
  className = '',
  itemClassName = '',
  selectedItemClassName = '',
  orientation = 'vertical',
  variant = 'default'
}: SidebarProps) => {
  // Default items if none provided
  const defaultItems: WidgetItem[] = [
    { id: "Weather", label: "Weather" },
    { id: "Analytics", label: "Analytics" },
    { id: "Dashboard", label: "Dashboard" }
  ];

  const widgetItems = items || defaultItems;

  const handleWidgetSelect = (item: WidgetItem) => {
    if (!item.disabled) {
      setSelectedWidget(item.id);
    }
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700',
    minimal: 'bg-transparent',
    bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm'
  };

  const orientationClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row overflow-x-auto'
  };

  const getItemClasses = (item: WidgetItem, isSelected: boolean) => {
    const baseClasses = 'flex items-center justify-between w-full p-3 text-left rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
    
    const stateClasses = isSelected 
      ? `bg-primary text-white font-medium shadow-md ${selectedItemClassName}`.trim()
      : item.disabled
      ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
      : `bg-gray-50 dark:bg-gray-700 text-foreground hover:bg-gray-100 dark:hover:bg-gray-600 ${itemClassName}`.trim();

    return `${baseClasses} ${stateClasses}`;
  };

  return (
    <aside className={`w-64 p-6 ${variantClasses[variant]} ${className}`.trim()}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-6">
          {title}
        </h3>
      )}
      
      <nav>
        <ul className={`flex ${orientationClasses[orientation]} space-y-2`}>
          {widgetItems.map((item) => {
            const isSelected = item.id === selectedWidget;
            
            return (
              <li key={item.id} className={orientation === 'horizontal' ? 'min-w-0 flex-shrink-0' : ''}>
                <button
                  onClick={() => handleWidgetSelect(item)}
                  disabled={item.disabled}
                  className={getItemClasses(item, isSelected)}
                  aria-current={isSelected ? 'page' : undefined}
                  aria-disabled={item.disabled}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    {item.icon && (
                      <span className="flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <span className="truncate">
                      {item.label}
                    </span>
                  </span>
                  
                  {item.badge && (
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-primary text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;