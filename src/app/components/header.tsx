"use client";

import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import Link from "next/link";
import Dropdown from "./dropdown";
import type { ReactNode } from 'react';

interface User {
  name: string;
  email?: string;
  id?: string;
}

interface HeaderProps {
  title?: string;
  navigation?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
  className?: string;
  children?: ReactNode;
  showUserDropdown?: boolean;
  customActions?: ReactNode;
}

const Header = ({
  title = 'Template',
  navigation = [
    { label: 'Dashboard', href: '/dashboard' }
  ],
  className = '',
  children,
  showUserDropdown = true,
  customActions
}: HeaderProps) => {
  const { user, setUser } = useUserContext();
  const router = useRouter();

  const logoutUser = async (): Promise<void> => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ User logged out successfully');
        setUser(null);
        router.push("/login");
      } else {
        console.error('❌ Logout failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Logout error:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <header className={`relative flex justify-between items-center h-16 px-6 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 ${className}`.trim()}>
      <div className="flex items-center">
        {children}
      </div>
      <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors duration-200 ${item.active ? 'text-primary dark:text-primary font-semibold' : ''
              }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        {customActions}
        {showUserDropdown && (
          <Dropdown logoutUser={logoutUser} user={user as User} />
        )}
      </div>
    </header>
  );
};

export default Header;