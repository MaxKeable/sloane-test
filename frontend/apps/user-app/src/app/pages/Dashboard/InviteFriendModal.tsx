import React, { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const EVENT_LINK = "https://zoom.us/j/91956192129";
const EVENT_TIME =
  "Thursday, 11th of September 2025, 10:30am–1:30pm (Brisbane time)";
const EVENT_DESC =
  "The Sloane Move Club is a focused online co-working event for business owners. We’ll move, work, and connect together—no awkward networking, just real momentum and good vibes. It’s free, friendly, and you’ll get a sneak peek at the latest Sloane features!";

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

interface InviteFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteFriendModal: React.FC<InviteFriendModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [friendName, setFriendName] = useState("");
  const [copied, setCopied] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

  if (!isOpen) return null;

  const userName = user?.firstName || user?.username || "A friend";

  const message = `Hi${friendName ? ", " + friendName : ""}!

I'm going along to this online event and I'd love to invite you to join me. It's free and is going to be super cool.

${EVENT_DESC}

Event details:
${EVENT_TIME}
Zoom link: ${EVENT_LINK}

Let me know if you can make it!

See you there,
${userName}
`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    // Save friend name to backend
    if (friendName.trim()) {
      const token = await getToken();
      await fetch("/api/admin/move-club/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invitedFriend: true,
          friendName: friendName.trim(),
        }),
      });
    }
    onClose();
    toast.success(
      `Beautiful! We're excited to have ${friendName.trim() || "your friend"} join our Move Club.`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[80vh] rounded-3xl bg-brand-cream/95 shadow-2xl overflow-hidden flex flex-col border border-brand-green/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Icon */}
        <div className="absolute -right-24 -top-24 opacity-10 pointer-events-none select-none">
          <FontAwesomeIcon
            icon={faEnvelopeOpenText}
            className="h-[18rem] w-[18rem] text-brand-green/30"
          />
        </div>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-brand-green/70 hover:text-brand-green transition-colors duration-300 z-20 text-2xl"
        >
          <span className="sr-only">Close</span>×
        </button>
        {/* Content */}
        <style>{scrollbarStyles}</style>
        <div className="flex flex-col h-full p-6 md:p-10 relative z-10 dashboard-scroll overflow-y-auto max-h-[70vh]">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-green mb-4">
            Invite a Friend
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-brand-green">
              Friend's Name
            </label>
            <input
              type="text"
              className="w-full border-b border-brand-green/40 rounded-none px-3 py-2 bg-transparent text-brand-green focus:outline-none focus:border-brand-green/80 placeholder-brand-green/40"
              value={friendName}
              onChange={(e) => {
                setFriendName(e.target.value);
                setCopied(false);
              }}
              placeholder="Enter your friend's name"
            />
          </div>
          <div className="mb-4 flex-1 flex flex-col">
            <label className="block text-sm font-medium mb-1 text-brand-green">
              Message Preview
            </label>
            <textarea
              className="w-full dashboard-scroll overflow-y-auto border-b border-brand-green/40 rounded-none px-3 py-2 text-sm bg-transparent text-brand-green/90 flex-1 focus:outline-none focus:border-brand-green/80 placeholder-brand-green/40"
              rows={8}
              value={message}
              readOnly
            />
          </div>
          <button
            onClick={handleCopy}
            className="w-full bg-brand-green text-brand-cream py-3 rounded-xl font-semibold hover:bg-brand-green-dark transition mt-2 shadow"
          >
            {copied ? "Copied!" : "Copy & Paste To Send This To Your Friend"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteFriendModal;
