import { useEffect, useRef, useState } from "react";

interface UseScrollBehaviorProps {
  messages?: any[];
  isMessageLoading: boolean;
}

/**
 * Hook to manage auto-scrolling behavior in chat
 */
export const useScrollBehavior = ({
  messages,
  isMessageLoading,
}: UseScrollBehaviorProps) => {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const responseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleUserScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsUserScrolling(scrollHeight - scrollTop > clientHeight + 50);
  };

  const scrollToBottom = () => {
    if (!isUserScrolling && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "auto",
      });
    }
  };

  const scrollToResponseTop = (messageId: string) => {
    const responseElement = responseRefs.current[messageId];
    if (responseElement) {
      responseElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isUserScrolling, isMessageLoading]);

  return {
    isUserScrolling,
    messagesEndRef,
    chatContainerRef,
    responseRefs,
    handleUserScroll,
    scrollToResponseTop,
  };
};
