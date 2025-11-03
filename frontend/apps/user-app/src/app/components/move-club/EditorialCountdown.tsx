import React, { useEffect, useState } from "react";

type Props = {
  eventDate: Date;
};

const EditorialCountdown: React.FC<Props> = ({ eventDate }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  function getTimeLeft() {
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }
  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center justify-center bg-white/10 rounded-xl shadow-lg border border-white/20 mx-auto md:px-6 py-4">
      {["days", "hours", "minutes", "seconds"].map((unit, idx) => (
        <div
          key={unit}
          className="flex flex-col items-center justify-center px-3 relative"
        >
          <span className="text-xl md:text-4xl font-thin tracking-tight text-brand-cream tabular-nums">
            {String(timeLeft[unit as keyof typeof timeLeft]).padStart(2, "0")}
          </span>
          <span className="text-[10px] md:text-sm font-thin uppercase tracking-widest text-brand-cream/70 mt-1">
            {unit}
          </span>
          {idx < 3 && (
            <div className="absolute right-0 top-2/4 -translate-y-1/2 h-8 w-px bg-white/30 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};
export default EditorialCountdown;
