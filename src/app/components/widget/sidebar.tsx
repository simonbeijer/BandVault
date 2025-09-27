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

  return (
    <aside className={`w-64 p-6`}>
    </aside>
  );
};

export default Sidebar;
