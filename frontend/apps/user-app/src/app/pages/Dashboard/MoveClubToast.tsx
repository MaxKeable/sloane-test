import React from "react";
import { motion } from "framer-motion";
import { FaCalendar, FaUserPlus, FaCheck } from "react-icons/fa";

interface MoveClubToastProps {
  onAddToCalendar: () => void;
  onInviteFriend: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

const scrollbarStyles = `
.dashboard-scroll::-webkit-scrollbar {
  width: 5px;
}
.dashboard-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.dashboard-scroll::-webkit-scrollbar-thumb {
  background: #FDF3E3;
  opacity: 0.3;
}
.dashboard-scroll::-webkit-scrollbar-thumb:hover {
  background: #FDF3E3;
  opacity: 0.5;
}
`;

const MoveClubToast: React.FC<MoveClubToastProps> = ({
  onAddToCalendar,
  onInviteFriend,
  onClose,
  isLoading,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-4 right-4 z-50 w-80 bg-brand-cream rounded-2xl shadow-2xl border border-brand-green/20"
    >
      <style>{scrollbarStyles}</style>
      <div className="p-6 dashboard-scroll overflow-y-auto max-h-96">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <FaCheck className="text-white text-sm" />
          </div>
          <div>
            <h3 className="font-bold text-brand-green text-lg">Great!</h3>
            <p className="text-brand-green/70 text-sm">
              You've Registered Your Spot
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onAddToCalendar}
            className="w-full flex items-center justify-center gap-2 bg-brand-green text-brand-cream py-3 px-4 rounded-xl font-medium hover:bg-brand-green/90 transition-colors"
          >
            <FaCalendar className="text-sm" />
            {isLoading ? "Loading..." : "Add to Calendar"}
          </button>

          <button
            onClick={onInviteFriend}
            className="w-full flex items-center justify-center gap-2 bg-brand-cream/10 text-brand-green py-3 px-4 rounded-xl font-medium hover:bg-brand-cream/20 transition-colors border border-brand-green/20"
          >
            <FaUserPlus className="text-sm" />
            {isLoading ? "Loading..." : "Invite A Friend"}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-brand-green/50 hover:text-brand-green transition-colors"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

export default MoveClubToast;
