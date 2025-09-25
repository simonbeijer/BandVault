import type { ReactNode } from "react";
import Header from "@/components/header";
import { UserProvider } from "@/context/userContext";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <UserProvider>
      <Header />
      <main>{children}</main>
    </UserProvider>
  );
}