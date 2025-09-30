"use client";
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/userContext";
import TermsModal from "@/components/termsModal";
import Sidebar from "@/app/components/dashboard/sidebar";
import UserInfo from "@/app/components/dashboard/userInfo";
import Chat from "@/app/components/chat/index"
export default function Dashboard() {
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const { user } = useUserContext();
  const [displayPage, setDisplayPage] = useState(1)

  useEffect(() => {
    const termsAccepted = localStorage.getItem('template-terms-accepted');
    if (!termsAccepted) {
      setShowTermsModal(true);
    }
  }, []);

  const closeTermsModal = (): void => {
    setShowTermsModal(false);
  };

  const selectedPage = (num: number) => {
    setDisplayPage(num)
  }

  const sideBarItems = [
    {
      selected: displayPage === 1,
      label: 'Chat',
      onClick: () => selectedPage(1)
    },
    {
      selected: displayPage === 2,
      label: 'User',
      onClick: () => selectedPage(2)
    }
  ]

  return (
    <div className="h-[calc(100vh-3rem)] bg-background flex flex-col overflow-hidden">
      <TermsModal isOpen={showTermsModal} onClose={closeTermsModal} showClose={false} />

      <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto p-4 gap-2">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
          <p className="text-grey">Here&apos;s your user information and dashboard overview.</p>
        </div>
        <Sidebar
          title="Options"
          items={sideBarItems}
        />
        {displayPage === 1 && (
          <Chat></Chat>
        )}
        {displayPage === 2 && (
          <UserInfo name={user?.name} email={user?.email}></UserInfo>
        )}

      </div>
    </div>
  );
}