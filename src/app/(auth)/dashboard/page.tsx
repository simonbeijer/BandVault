"use client";
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/userContext";
import TermsModal from "@/components/termsModal";
import Sidebar from "@/app/components/dashboard/sidebar";
import UserInfo from "@/app/components/dashboard/userInfo";
import AddSong from "@/components/dashboard/addSong";
import Songs from "@/components/dashboard/songs";
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
    // {
    //   selected: displayPage === 2,
    //   label: 'User',
    //   onClick: () => selectedPage(2)
    // },
    {
      selected: displayPage === 4,
      label: 'Songs',
      onClick: () => selectedPage(4)
    },
    {
      selected: displayPage === 3,
      label: 'Add Song',
      onClick: () => selectedPage(3)
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
        <div className="flex flex-col flex-1 overflow-visible">
          {displayPage === 1 && (
            <Chat></Chat>
          )}
          {displayPage === 2 && (
            <UserInfo name={user?.name} email={user?.email}></UserInfo>
          )}
          {displayPage === 3 && (
            <AddSong></AddSong>
          )}
          {displayPage === 4 && (
            <Songs></Songs>
          )}
        </div>
      </div>
    </div>
  );
}