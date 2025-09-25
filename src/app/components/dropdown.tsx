"use client";

import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Spinner from "./spinner";
import Image from "next/image";

// Simplified User type for the dropdown
interface User {
  name: string;
  email?: string;
  avatar?: string;
}

interface DropdownProps {
  user: User | null;
  logoutUser: () => void;
}

export default function Dropdown({ user, logoutUser }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt={`${user.name} avatar`}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 p-4 w-56 border rounded-lg shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          role="menu"
          onKeyDown={handleKeyDown}
        >
          {user ? (
            <>
              <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </p>
                {user.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                role="menuitem"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-16">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
