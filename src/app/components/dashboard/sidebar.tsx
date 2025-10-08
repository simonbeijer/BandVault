"use client";

import type { ReactNode } from 'react';

interface Items {
    selected: boolean,
    label: string,
    onClick: () => void
    icon?: ReactNode;
}

interface SidebarProps {
    title?: string;
    items?: Items[];
    selectedItemClassName?: string;
    orientation?: 'vertical' | 'horizontal';
}

const Sidebar = ({
    title = "Dashboard",
    items,
    orientation = 'vertical',
}: SidebarProps) => {

    return (
        <div className={`w-full bg-background rounded-lg shadow-sm border border-grey p-4`}>
            <ul className={`flex flex-row gap-2`}>
                {items?.map((item, index) => (
                    <li key={index} onClick={item.onClick} className={`cursor-pointer bg-background rounded-lg shadow-sm border border-grey p-2 ${item.selected ? 'bg-primary' : ''}`}>
                        <span>{item.icon}</span>
                        {item.label}
                    </li>
                ))}

            </ul>
        </div>
    );
};

export default Sidebar;
