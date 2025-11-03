import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loadingAnimationUrl from "../../../../../assets/animations/chat-loading.lottie?url";

export const ChatLoading: React.FC = () => {
  return (
    <div className="-translate-x-24">
      <DotLottieReact
        className="h-28"
        src={loadingAnimationUrl}
        loop
        autoplay
      />
    </div>
  );
};
