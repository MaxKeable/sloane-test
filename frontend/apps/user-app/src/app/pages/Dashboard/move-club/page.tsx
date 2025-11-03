import { useState } from "react";
import MoveClubSlides from "../../../components/move-club/move-club-slides";
import EditorialCountdown from "../../../components/move-club/EditorialCountdown";
import SaveYourSeatButton from "../../../components/move-club/save-your-seat";
import EditorialModal from "../../../components/move-club/EditorialModal";
import { useGetNextMoveClub } from "@/api/use-move-club-api";
import { DateValue } from "@repo/ui-kit/components/ui/date-value";
const MoveClub = () => {
  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);
  const { data: moveClub, isLoading, error } = useGetNextMoveClub();

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row w-full py-8">
        <div className="w-full md:w-1/2 lg:w-2/5 xl:pl-8">
          <MoveClubSlides dateTime={new Date()} />
        </div>
        <div className="flex items-end order-1 md:order-2">
          <div className="my-8 md:my-0 3xl:ml-48 md:ml-8 w-full">
            <p className="text-brand-cream text-3xl font-Black ml-1 mb-1">
              The Move Club
            </p>
            <p className="text-brand-white/70 font-thin ml-1 mb-1">
              Loading event details...
            </p>
            <div className="flex items-center justify-center bg-white/10 rounded-xl shadow-lg border border-white/20 mx-auto md:px-6 py-4">
              <div className="animate-pulse text-brand-cream">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !moveClub) return null;

  return (
    <>
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2 lg:w-2/5">
          <MoveClubSlides dateTime={moveClub.eventDateTime} />
        </div>
        <div className="flex items-end order-1 md:order-2">
          <div className="my-8 md:my-0 3xl:ml-48 md:ml-8 w-full">
            <p className="text-brand-cream text-3xl font-Black ml-1 mb-1">
              {moveClub.eventTitle || "The Move Club"}
            </p>
            <p className="text-brand-white/70 font-thin ml-1 mb-1">
              <DateValue date={moveClub.eventDateTime} format="date-time" />
              <span className="text-xs"> AEST</span>
            </p>
            <EditorialCountdown eventDate={new Date(moveClub.eventDateTime)} />
            <div className="flex w-full justify-between items-center gap-4">
              <SaveYourSeatButton moveClub={moveClub} isLoading={isLoading} />
              <button
                className="mt-2 px-6 py-2 rounded-xl w-1/2 border border-brand-cream/50 text-brand-white font-semibold shadow hover:text-brand-green-dark hover:bg-brand-logo transition"
                onClick={() => {
                  setIsEditorialModalOpen(true);
                }}
              >
                Tell Me More
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditorialModal
        isOpen={isEditorialModalOpen}
        onClose={() => setIsEditorialModalOpen(false)}
      />
    </>
  );
};

export default MoveClub;
