import type { ReactNode } from "react";
import { UserProvider } from "@/context/userContext";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <UserProvider>
      <header className="relative flex justify-between items-center h-12 px-4">
      </header>
      <main>{children}</main>
    </UserProvider>
  );
}