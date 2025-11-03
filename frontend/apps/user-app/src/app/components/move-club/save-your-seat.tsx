import React, { useState } from "react";
import { toast } from "react-hot-toast";
import MoveClubToast from "../../pages/Dashboard/MoveClubToast";
import { downloadICS } from "./add-to-calendar-button";
import InviteFriendModal from "../../pages/Dashboard/InviteFriendModal";
import {
  MoveClubWithRegistration,
  useCreateMoveClubRegistration,
  useUpdateMoveClubRegistration,
} from "@/api/use-move-club-api";

type Props = {
  moveClub?: MoveClubWithRegistration;
  isLoading?: boolean;
};

const SaveYourSeatButton: React.FC<Props> = ({ moveClub, isLoading }) => {
  const [showToast, setShowToast] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { mutate: createMoveClubRegistration, isPending: isCreating } =
    useCreateMoveClubRegistration();
  const { mutate: updateMoveClubRegistration, isPending: isUpdating } =
    useUpdateMoveClubRegistration();

  const handleRegister = () => {
    createMoveClubRegistration(
      { moveClubId: moveClub?.id ?? "" },
      {
        onSuccess: () => {
          setShowToast(true);
        },
        onError: () => {
          toast.error("Failed to register for Move Club");
        },
      }
    );
  };

  const handleAddToCalendar = async () => {
    if (!moveClub || !moveClub.registrations?.[0]?.id) {
      toast.error("No registration found");
      return;
    }

    downloadICS(moveClub);
    updateMoveClubRegistration(
      { id: moveClub.registrations[0].id, addedToCalendar: true },
      {
        onSuccess: () => {
          toast(
            <div className="flex items-center justify-center gap-3 min-w-[300px]">
              <div className="bg-brand-green/20 p-2 rounded-full">📅</div>
              <span className="text-brand-green-dark font-medium">
                Now simply click that downloaded file and it will add it to your
                calendar. Easy :)
              </span>
            </div>,
            {
              duration: 6000,
              position: "top-center",
              style: {
                background: "#FDF3E3",
                padding: "8px",
                color: "#003b1f",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                width: "auto",
                maxWidth: "500px",
                margin: "0 auto",
              },
            }
          );
        },
        onError: () => {
          toast.error("Failed to add to calendar");
        },
      }
    );
  };

  const handleInviteFriend = () => {
    if (!moveClub?.registrations?.[0]?.id) {
      toast.error("No registration found");
      return;
    }

    updateMoveClubRegistration(
      { id: moveClub.registrations[0].id, invitedFriend: true },
      {
        onSuccess: () => {
          setShowInviteModal(true);
        },
        onError: () => {
          toast.error("Failed to invite friend");
        },
      }
    );
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="w-1/2 mt-2 px-2 md:px-6 py-2 rounded-xl bg-gray-200 text-gray-500 font-semibold shadow cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (!moveClub) {
    return (
      <button
        disabled
        className="w-1/2 mt-2 px-2 md:px-6 py-2 rounded-xl bg-gray-200 text-gray-500 font-semibold shadow cursor-not-allowed"
      >
        No Event Available
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleRegister}
        className="w-1/2 mt-2 px-2 md:px-6 py-2 rounded-xl bg-brand-cream text-brand-green font-semibold shadow hover:text-brand-green-dark hover:bg-brand-logo transition"
        disabled={moveClub.registrations.length > 0}
      >
        {moveClub.registrations.length > 0
          ? "Already Registered"
          : isCreating
            ? "Saving Your Seat..."
            : "Save Your Seat"}
      </button>
      {showToast && (
        <MoveClubToast
          isLoading={isUpdating}
          onAddToCalendar={handleAddToCalendar}
          onInviteFriend={handleInviteFriend}
          onClose={handleCloseToast}
        />
      )}
      {showInviteModal && (
        <InviteFriendModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </>
  );
};

export default SaveYourSeatButton;
