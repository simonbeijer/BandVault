"use client";

import { useState } from "react";
import Modal from "@/app/components/modal";
import Button from "@/app/components/button";
import { 
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import CheckboxField from "@/app/components/checkboxField";
import NoticeCard from "@/app/components/noticeCard";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showClose?: boolean;
  projectName?: string;
  onTermsAccepted?: () => void;
  customTermsContent?: React.ReactNode;
}

const TermsModal = ({ 
  isOpen, 
  onClose, 
  showClose = true,
  projectName = 'Template',
  onTermsAccepted,
  customTermsContent,
}: TermsModalProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const canProceed = termsAccepted;

  const handleAcceptTerms = () => {
    if (canProceed) {
      // Store acceptance in localStorage with project-specific key
      const storageKey = `${projectName.toLowerCase().replace(/\s+/g, '-')}-terms-accepted`;
      localStorage.setItem(storageKey, new Date().toISOString());
      
      // Call custom handler if provided
      if (onTermsAccepted) {
        onTermsAccepted();
      }
      
      onClose();
    }
  };

  const handleModalClose = () => {
    // Reset form state when modal closes
    setTermsAccepted(false);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleModalClose} 
      showClose={showClose}
      title="Terms of Use & Privacy Notice"
      size="xl"
      closeOnBackdropClick={false}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Disclaimer Section */}
        <NoticeCard
          variant="info"
          icon={<InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          title="Terms of Use & Privacy Notice"
        >
          {customTermsContent || (
            <p>
              This application provides web services and functionality. Use at your own risk. 
              We bear no responsibility for any outcomes or consequences arising from the use of this service. 
              This service processes user data to provide functionality. Your information 
              may be stored and processed according to our privacy policies. 
              Please avoid sharing sensitive personal information.
            </p>
          )}
        </NoticeCard>

        {/* Consent Checkboxes */}
        <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
          <CheckboxField
            id="terms-checkbox"
            checked={termsAccepted}
            onChange={setTermsAccepted}
            required
          >
            I agree to the Terms of Service and Privacy Policy.
          </CheckboxField>
        </div>

        {/* Accept Button */}
        <div className="text-center pt-4">
          <Button
            variant={canProceed ? "primary" : "secondary"}
            size="lg"
            callBack={handleAcceptTerms}
            disabled={!canProceed}
            className="min-w-[200px]"
          >
            {canProceed ? "Accept & Continue" : "Please accept terms to continue"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TermsModal;
