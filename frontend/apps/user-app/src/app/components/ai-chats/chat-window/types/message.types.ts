import type { ChatMessage } from "../../../../../types/chat";

// Extended message type for UI rendering
// Combines backend ChatMessage with UI-only fields like component
// Converts null to undefined for better UI compatibility
export interface IMessage extends Omit<ChatMessage, 'id' | 'file_type' | 'imageUrl' | 'imageName'> {
  _id: string; // Alias for id to match legacy code
  component?: React.ReactNode; // UI-only field for loading state
  file_type?: string; // Optional field, null converted to undefined
  imageUrl?: string; // Optional field, null converted to undefined
  imageName?: string; // Optional field, null converted to undefined
}

// Helper function to convert ChatMessage to IMessage
// Converts null values to undefined for compatibility with UI components
export function toIMessage(message: ChatMessage, component?: React.ReactNode): IMessage {
  return {
    ...message,
    _id: message.id,
    component,
    // Convert null to undefined for optional fields
    file_type: message.file_type ?? undefined,
    imageUrl: message.imageUrl ?? undefined,
    imageName: message.imageName ?? undefined,
  };
}

// Helper function to convert IMessage back to ChatMessage
export function toChatMessage(message: IMessage): ChatMessage {
  const { _id, component, file_type, imageUrl, imageName, ...rest } = message;
  return {
    ...rest,
    id: _id,
    file_type: file_type ?? null,
    imageUrl: imageUrl ?? null,
    imageName: imageName ?? null,
  };
}

export interface MessageActionsProps {
  answer: string;
  messageId: string;
  theme: string;
  onCopy: (text: string) => void;
  onSaveAction: (text: string) => void;
  onScrollToTop: (messageId: string) => void;
}

