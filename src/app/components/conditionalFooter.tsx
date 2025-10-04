"use client";

import { usePathname } from "next/navigation";

interface ConditionalFooterProps {
  hiddenPaths?: string[];
  className?: string;
}

const ConditionalFooter = ({ 
  hiddenPaths = ["/login", "/dashboard", "/song"],
  className = ''
}: ConditionalFooterProps) => {
  const pathname = usePathname();
  
  // Hide footer on specified paths
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <footer className={`flex justify-center items-center h-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto ${className}`.trim()}>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © 2025 BandVault
      </p>
    </footer>
  );
};

export default ConditionalFooter;