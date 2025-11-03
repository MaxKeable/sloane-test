import { useState, useImperativeHandle, forwardRef } from "react";

import PrimaryModal from "../PrimaryModal";
import CreateAssistantModal from "../CreateAssistantModal";

interface ModalsProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  onOpenPrimaryModal?: () => void;
}

export interface ModalsRef {
  openPrimaryModal: () => void;
}

const Modals = forwardRef<ModalsRef, ModalsProps>(
  ({ isCreateModalOpen, setIsCreateModalOpen, onOpenPrimaryModal }, ref) => {
    const [isPrimaryModalOpen, setIsPrimaryModalOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openPrimaryModal: () => {
        setIsPrimaryModalOpen(true);
        onOpenPrimaryModal?.();
      },
    }));

    const handleClosePrimaryModal = () => setIsPrimaryModalOpen(false);

    return (
      <>
        {/* PrimaryModal component handling */}
        {isPrimaryModalOpen && (
          <PrimaryModal onClose={handleClosePrimaryModal} />
        )}

        <CreateAssistantModal
          isOpen={isCreateModalOpen}
          closeModal={() => setIsCreateModalOpen(false)}
        />
      </>
    );
  }
);

export default Modals;
