import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { MoveClub } from "@backend/src/model/types";

export function downloadICS(moveClub?: MoveClub) {
  if (!moveClub) return;

  const eventDate = new Date(moveClub.eventDateTime);
  const endDate = new Date(eventDate.getTime() + moveClub.duration * 60 * 1000);

  const formatDateForICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const dtStart = formatDateForICS(eventDate);
  const dtEnd = formatDateForICS(endDate);
  const eventTitle = moveClub.eventTitle || "Sloane Move Club";
  const eventLink = moveClub.eventLink || "https://zoom.us/j/91956192129";
  const eventDescription = `Join the Sloane Move Club!\n\nEvent link: ${eventLink}`;

  const EVENT_TITLE = eventTitle;
  const EVENT_DESCRIPTION = eventDescription;
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${EVENT_TITLE}`,
    `DESCRIPTION:${EVENT_DESCRIPTION}`,
    `LOCATION:${eventLink}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([icsContent], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${eventTitle.replace(/[^a-zA-Z0-9]/g, "")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

type Props = {
  moveClub?: MoveClub;
};

const AddToCalendarButton: React.FC<Props> = ({ moveClub }) => {
  const { getToken } = useAuth();

  const handleClick = async () => {
    if (!moveClub) return;

    // 1. Download the .ics file
    downloadICS(moveClub);
    // 2. Track calendar add in backend
    try {
      const token = await getToken();
      await fetch("/api/admin/move-club/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ addedToCalendar: true }),
      });
    } catch (error) {
      console.error("Failed to track Add to Calendar:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mt-2 px-6 py-2 rounded-xl bg-brand-cream text-brand-green font-semibold shadow hover:text-brand-green-dark  hover:bg-brand-logo transition"
    >
      Save Your Seat
    </button>
  );
};

export default AddToCalendarButton;
