import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useState } from "react";
import {
  FaTimes,
  FaCheckSquare,
  FaPalette,
  FaList,
  FaEdit,
  FaTags,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

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

interface Note {
  id: string;
  text: string;
  timestamp: Date;
  checked: boolean;
}

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: {
    _id: string;
    text: string;
    notes: Note[];
    colour?: string;
    title: string;
    tags?: string[];
  };
  onAddNote: (note: string) => Promise<void>;
  onToggleNote: (noteId: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onColorChange: (color: string) => Promise<void>;
  onTitleChange: (newTitle: string) => Promise<void>;
}

const ActionModal = ({
  isOpen,
  onClose,
  action,
  onAddNote,
  onToggleNote,
  onDeleteNote,
  onColorChange,
  onTitleChange,
}: ActionModalProps) => {
  const [newNote, setNewNote] = useState("");
  const [showNotes, setShowNotes] = useState(true);
  const [showColors, setShowColors] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(action.title);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const handleAddNote = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newNote.trim()) {
      await onAddNote(newNote);
      setNewNote("");
    }
  };

  const handleTitleSubmit = async () => {
    if (editedTitle.trim() !== "") {
      await onTitleChange(editedTitle);
      setIsEditingTitle(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="action-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "#4b8052",
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: "80vh",
          display: "flex",
        }}
      >
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-brand-cream mb-2">
                Action Details
              </h2>
              <div className="h-1 w-20 bg-brand-cream rounded"></div>
            </div>
            <button
              onClick={onClose}
              className="text-brand-cream hover:text-brand-cream/80"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-brand-cream">Title</h3>
              <button
                onClick={() => {
                  if (isEditingTitle) {
                    handleTitleSubmit();
                  } else {
                    setIsEditingTitle(true);
                  }
                }}
                className="text-brand-cream/80 hover:text-brand-cream"
              >
                <FaEdit size={16} />
              </button>
            </div>
            {isEditingTitle ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleTitleSubmit();
                    }
                  }}
                  className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0"
                  autoFocus
                />
              </div>
            ) : (
              <div className="text-brand-cream bg-brand-green-dark/20 p-4 rounded-lg">
                {action.title}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-brand-cream">
              Response From Sloane Chat
            </h3>
            <div
              className={`text-brand-cream bg-brand-green-dark/20 p-4 rounded-lg overflow-y-auto
                ${!isTextExpanded ? "max-h-[200px]" : "max-h-[400px]"}
                scrollbar-thin scrollbar-thumb-brand-cream/20 scrollbar-track-transparent hover:scrollbar-thumb-brand-cream/40`}
            >
              <div
                className={`prose prose-invert ${!isTextExpanded ? "line-clamp-[8]" : ""}`}
              >
                <ReactMarkdown>{action.text}</ReactMarkdown>
              </div>
            </div>
            {action.text.length > 300 && (
              <button
                onClick={() => setIsTextExpanded(!isTextExpanded)}
                className="mt-2 text-brand-cream/80 hover:text-brand-cream text-sm font-medium"
              >
                {isTextExpanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          {showNotes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-brand-cream flex items-center gap-2">
                <FaCheckSquare />
                Checklist
              </h3>
              <div className="space-y-3">
                {action.notes?.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-3 text-brand-cream border-b border-brand-cream/20 pb-2"
                  >
                    <input
                      type="checkbox"
                      checked={note.checked}
                      onChange={() => onToggleNote(note.id)}
                      className="w-4 h-4"
                    />
                    <span className="flex-1">{note.text}</span>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="text-brand-cream/80 hover:text-brand-cream"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-3 text-brand-cream">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={handleAddNote}
                    placeholder="Add a new item (press Enter)"
                    className="w-full bg-transparent border-b border-brand-cream/20 focus:border-brand-cream outline-none px-2 py-1"
                  />
                </div>
              </div>
            </div>
          )}
          {action.tags && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-brand-cream flex items-center gap-2">
                <FaTags />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {action.tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-brand-green-dark/20 px-2 py-1 rounded-full text-brand-cream"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-48 bg-brand-green-dark/20 p-4 flex flex-col gap-3">
          <button
            onClick={() => {
              setShowNotes(true);
              setShowColors(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showNotes
                ? "bg-brand-green text-brand-cream"
                : "text-brand-cream/80 hover:bg-brand-green/20"
            }`}
          >
            <FaList />
            Checklist
          </button>
          <button
            onClick={() => {
              setShowColors(true);
              setShowNotes(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showColors
                ? "bg-brand-green text-brand-cream"
                : "text-brand-cream/80 hover:bg-brand-green/20"
            }`}
          >
            <FaPalette />
            Colors
          </button>

          {showColors && (
            <div className="mt-4 space-y-2">
              {Object.entries(COLOR_OPTIONS).map(([name, value]) => (
                <button
                  key={name}
                  onClick={() => onColorChange(value)}
                  className="w-full p-2 rounded-lg text-left text-brand-green-dark font-light hover:font-medium hover:bg-brand-green/20 transition-colors"
                  style={{ backgroundColor: value }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ActionModal;
