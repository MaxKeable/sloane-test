import React, { useState, useEffect } from "react";
import { FaList, FaTag, FaPalette, FaCalendar } from "react-icons/fa";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/context/ChatContext";
import { useCreateChat } from "@/api/use-chat-api";

/***************************************************************
                NOTES
***************************************************************/
/*
- Component for the sidebar in the SaveActionModal
- Handles checklist, tags, colors, due date, and assistant selection
- Uses brand colors and consistent styling
- Implements proper error handling and loading states
*/

/***************************************************************
                Types
***************************************************************/
interface Note {
  id: string;
  text: string;
  checked: boolean;
}

interface SidebarProps {
  notes: Note[];
  showTags: boolean;
  selectedColor: string;
  dueDate: string;
  onAddChecklist: () => void;
  onRemoveChecklist: () => void;
  onToggleTags: () => void;
  onColorSelect: (color: string) => void;
  onDueDateChange: (date: string) => void;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  className?: string;
  sloaneText?: string; // Optional prop for context message
}

/***************************************************************
                Constants
***************************************************************/
const COLOR_OPTIONS = {
  Ocean: "#bdd8d4",
  Cacao: "#9f9071",
  Tumeric: "#f4d78e",
  Chai: "#dfc99e",
  Clay: "#ddb794",
  Mint: "#b8e1bf",
  Matcha: "#e2edab",
  Coconut: "#e6dccb",
} as const;

/***************************************************************
                Components
***************************************************************/
export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  showTags,
  selectedColor,
  dueDate,
  onAddChecklist,
  onRemoveChecklist,
  onToggleTags,
  onColorSelect,
  onDueDateChange,
  isEditing,
  onCancel,
  onSubmit,
  className = "",
  sloaneText = "", // Default to empty string if not provided
}) => {
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigationData, setNavigationData] = useState<{
    assistantId: string;
    chatId: string;
  } | null>(null);
  // const { assistants, isLoading } = useAssistants();
  const navigate = useNavigate();
  const chatContext = useChat();
  const { setSelectedChat } = chatContext;
  // const { setSelectedAssistant } = useAssistant();
  const createChatMutation = useCreateChat();

  // Effect to handle navigation
  useEffect(() => {
    if (shouldNavigate && navigationData) {
      console.log("Effect triggered navigation to:", navigationData);
      navigate(
        `/assistant/${navigationData.assistantId}?chat=${navigationData.chatId}`,
        { replace: true }
      );
      setShouldNavigate(false);
      setNavigationData(null);
    }
  }, [shouldNavigate, navigationData, navigate]);

  // Assistant selection feature disabled - contexts removed
  // const handleAssistantClick = async (assistant: IAssistant) => {
  //   try {
  //     // Create a new chat with the selected assistant using tRPC
  //     const newChat = await createChatMutation.mutateAsync({
  //       assistantId: assistant._id,
  //     });
  //     if (newChat) {
  //       setSelectedChat(newChat);
  //       setSelectedAssistant(assistant._id);
  //       setShowAssistantModal(false);

  //       // Navigate first
  //       navigate(`/assistant/${assistant._id}?chat=${newChat.id}`);

  //       // Then try to send the message
  //       try {
  //         const contextMessage = `Before we begin here is the context of what I am working on …\n\n${sloaneText}`;
  //         setTimeout(() => {
  //           chatContext.sendChat(
  //             contextMessage,
  //             "defaultRoom",
  //             null,
  //             newChat.id
  //           );
  //         }, 1000);
  //       } catch (messageError) {
  //         console.error("Error sending initial message:", messageError);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error creating new chat:", error);
  //     setShowAssistantModal(false);
  //   }
  // };

  return (
    <div
      className={`bg-brand-green-dark/20 p-4 flex-col h-full justify-between ${className}`}
    >
      <div>
        <div className="flex flex-col gap-2">
          <button
            onClick={notes.length === 0 ? onAddChecklist : onRemoveChecklist}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
              notes.length > 0
                ? "bg-brand-green text-brand-cream p-2 border border-brand-cream/70 shadow-lg"
                : "text-brand-cream/80 hover:bg-brand-green/20 border border-brand-cream/30 shadow-sm "
            }`}
          >
            <FaList />
            {notes.length === 0 ? "Add Checklist" : "Remove Checklist"}
          </button>

          <button
            onClick={onToggleTags}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
              showTags
                ? "bg-brand-green text-brand-cream p-2 border border-brand-cream/70 shadow-lg"
                : "text-brand-cream/80 hover:bg-brand-green/20 border border-brand-cream/30 shadow-sm"
            }`}
          >
            <FaTag />
            Add Tags
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-brand-cream flex items-center gap-2">
            <FaPalette />
            Colours
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(COLOR_OPTIONS).map(([name, color]) => (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  selectedColor === color
                    ? "ring-4 ring-white shadow-lg font-Black"
                    : "hover:ring-2 hover:ring-brand-cream/50"
                }`}
                style={{ backgroundColor: color }}
              >
                <span className="text-xs font-medium text-brand-green-dark">
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-brand-cream flex items-center gap-2">
            <FaCalendar />
            Due Date
          </h3>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="w-full p-2 rounded-lg bg-brand-green-dark/20 text-brand-cream border border-brand-cream/30 shadow-sm focus:ring-0"
          />
        </div>

        {/* Assistant selection feature disabled - contexts removed */}
        {/* <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2 text-brand-cream flex items-center gap-2">
            <span className="text-brand-cream">
              <FaRobot />
            </span>{" "}
            Continue Chat...
          </h3>

          <button
            onClick={() => setShowAssistantModal(true)}
            className="w-full p-2 rounded-lg bg-brand-green-dark/20 text-brand-cream border border-brand-cream/30 shadow-sm hover:bg-brand-green/20 transition-colors"
          >
            Select Assistant
          </button>
        </div> */}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <Footer isEditing={isEditing} onCancel={onCancel} onSubmit={onSubmit} />
      </div>

      {/* Assistant selection modal disabled - contexts removed */}
      {/* <Modal
        open={showAssistantModal}
        onClose={() => setShowAssistantModal(false)}
        className="flex items-center justify-center"
      >
        <Box className="bg-brand-green-dark p-6 rounded-lg w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-brand-cream mb-4">
            Select an Assistant
          </h2>
          {isLoading ? (
            <div className="text-brand-cream">Loading assistants...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assistants.map((assistant) => (
                <motion.div
                  key={assistant._id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7 }}
                >
                  <button
                    onClick={() => handleAssistantClick(assistant)}
                    className="w-full bg-brand-cream text-brand-green rounded-3xl shadow-lg hover:bg-brand-logo hover:text-brand-green hover:shadow-2xl hover:transition-all active:text-brand-logo active:underline hover:cursor-pointer transition-all duration-300 p-4 text-center"
                  >
                    <h3 className="text-sm md:text-base lg:text-lg font-semibold uppercase">
                      {assistant.jobTitle}
                    </h3>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </Box>
      </Modal> */}
    </div>
  );
};
