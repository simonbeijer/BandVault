"use client";

import { usePathname } from "next/navigation";

interface ConditionalFooterProps {
  hiddenPaths?: string[];
  className?: string;
  companyName?: string;
  year?: number;
}

const ConditionalFooter = ({ 
  hiddenPaths = ["/login"],
  className = '',
  companyName = 'Template',
  year = new Date().getFullYear()
}: ConditionalFooterProps) => {
  const pathname = usePathname();
  
  // Hide footer on specified paths
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <footer className={`flex justify-center items-center h-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto ${className}`.trim()}>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © {year} {companyName}
      </p>
    </footer>
  );
};

export default ConditionalFooter;