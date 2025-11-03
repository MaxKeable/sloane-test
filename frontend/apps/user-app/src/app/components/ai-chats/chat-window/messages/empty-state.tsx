import React from "react";

export const EmptyState: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className={`text-brand-cream text-center`}>
        Click on a chat or start a new chat to begin.
      </p>
      <p className="text-sm">(Remember you can always put chats in folders)</p>
    </div>
  );
};
