"use client";

import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import Link from "next/link";
import Dropdown from "./dropdown";
import type { ReactNode } from 'react';
import Image from 'next/image'

interface User {
  name: string;
  email?: string;
  id?: string;
}

const Header = () => {
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
    <header className="relative flex justify-between items-center h-16 md:px-6 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center"></div>
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto md:px-10">

        <div className="flex items-center md:gap-2">
          <Image
            src="/band-vault-icon.png"
            alt="image of a vault filled with music"
            width={60}
            height={60}
          />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Band Vault
          </h1>
        </div>
        <nav className="flex items-center md:gap-4">
          {user && (
            <Link
              href="/dashboard"
              className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
          )}
        </nav>
      </div>
      <div className="flex items-center md:gap-4">
        {user && (
          <Dropdown logoutUser={logoutUser} user={user as User} />
        )}
      </div>
    </header>
  );
};

export default Header;