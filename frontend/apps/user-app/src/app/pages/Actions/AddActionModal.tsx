import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  FaTimes,
  FaCheckSquare,
  FaPalette,
  FaList,
  FaCalendar,
  FaTag,
} from "react-icons/fa";
import { showSuccessToast } from "../../components/Toast/SuccessToast";

interface AddActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    text: string;
    column: string;
    notes: string[];
    colour: string;
    dueDate: string;
    tags: string[];
    description: string;
    priority: string;
  }) => Promise<void>;
  column: string;
}

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

const COLUMN_OPTIONS = {
  idea: "Idea",
  toDo: "To Do",
  inProgress: "In Progress",
  complete: "Complete",
} as const;

const PRIORITY_OPTIONS = ["None", "Low", "Medium", "High"] as const;

interface ChecklistItem {
  text: string;
  checked: boolean;
}

const AddActionModal: React.FC<AddActionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  column: initialColumn,
}) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState<ChecklistItem[]>([]);
  const [, setShowColors] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState<Array<{ text: string; color: string }>>([]);
  const [newTag, setNewTag] = useState({ text: "", color: "#FFE5A5" });
  const [currentColumn, setCurrentColumn] = useState(initialColumn);
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<(typeof PRIORITY_OPTIONS)[number]>("None");

  const addNewChecklist = () => {
    setNotes([{ text: "", checked: false }]);
  };

  const toggleChecked = (index: number) => {
    setNotes((prevNotes) =>
      prevNotes.map((note, i) =>
        i === index ? { ...note, checked: !note.checked } : note
      )
    );
  };

  const removeAllChecklist = () => {
    setNotes([]);
  };

  const resetModal = () => {
    setTitle("");
    setNotes([]);
    setShowColors(false);
    setShowTags(false);
    setSelectedColor("");
    setDueDate("");
    setTags([]);
    setNewTag({ text: "", color: "#FFE5A5" });
    setDescription("");
    setPriority("None");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSubmit = async () => {
    await onSubmit({
      title: title || "Untitled Action",
      text: title,
      column: currentColumn,
      notes: notes
        .filter((note) => note.text.trim() !== "")
        .map((note) => note.text),
      colour: selectedColor,
      dueDate,
      tags: tags.map((tag) => tag.text),
      description,
      priority,
    });
    showSuccessToast("Action created successfully!");
    resetModal();
    onClose();
  };

  const addTag = () => {
    if (newTag.text.trim()) {
      setTags([...tags, newTag]);
      setNewTag({ text: "", color: "#FFE5A5" });
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "90%", md: "90%", lg: 800 },
          bgcolor: "#4b8052",
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {/* Main Content - Different layouts for mobile/tablet vs desktop */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-cream">
          {/* Mobile/Tablet Layout (xs to md screens) */}
          <div className="lg:hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-brand-cream mb-2">
                  Create New Action
                </h2>
                <div className="h-1 w-20 bg-brand-cream rounded"></div>
              </div>
              <button
                onClick={handleClose}
                className="text-brand-cream hover:text-brand-cream/80"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Column Selector */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-brand-cream">
                  Select Column
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(COLUMN_OPTIONS).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setCurrentColumn(value)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentColumn === value
                          ? "bg-brand-green text-brand-cream"
                          : "bg-brand-green-dark/20 text-brand-cream/80 hover:bg-brand-green/20"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="flex flex-col gap-3">
                {/* Priority Dropdown */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center mb-1">
                    <h3 className="text-lg font-semibold text-brand-cream">
                      Priority
                    </h3>
                  </div>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(
                        e.target.value as (typeof PRIORITY_OPTIONS)[number]
                      )
                    }
                    className="w-full p-2 rounded-lg bg-brand-green-dark/20 text-brand-cream border-0 focus:ring-0 cursor-pointer"
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-brand-green text-brand-cream"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags display above buttons */}
                {showTags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full flex items-center gap-2"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.text}
                        <button onClick={() => removeTag(index)}>
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowTags(!showTags)}
                    className={`flex items-center gap-2 rounded-lg transition-colors p-2 ${
                      showTags
                        ? "bg-brand-green text-brand-cream"
                        : "bg-brand-green-dark/20 text-brand-cream/80 hover:bg-brand-green/20"
                    }`}
                  >
                    <FaTag />
                    <span>Add Tags</span>
                  </button>

                  <button
                    onClick={
                      notes.length === 0 ? addNewChecklist : removeAllChecklist
                    }
                    className={`flex items-center gap-2 rounded-lg transition-colors p-2 ${
                      notes.length > 0
                        ? "bg-brand-green text-brand-cream"
                        : "bg-brand-green-dark/20 text-brand-cream/80 hover:bg-brand-green/20"
                    }`}
                  >
                    <FaList />
                    <span>
                      {notes.length === 0
                        ? "Add Checklist"
                        : "Remove Checklist"}
                    </span>
                  </button>
                </div>

                {/* Tag input below buttons */}
                {showTags && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newTag.text}
                      onChange={(e) =>
                        setNewTag({ ...newTag, text: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newTag.text.trim()) {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1 p-2 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50"
                      placeholder="Add a tag (press Enter)"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-brand-green text-brand-cream rounded-lg hover:bg-brand-green-dark transition-colors"
                    >
                      Add Tag
                    </button>
                  </div>
                )}

                {/* Checklist items below buttons */}
                {notes.length > 0 && (
                  <div className="space-y-3">
                    {notes.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-brand-cream border-b border-brand-cream/20 pb-2"
                      >
                        <input
                          type="checkbox"
                          checked={note.checked}
                          onChange={() => toggleChecked(index)}
                          className="w-4 h-4 rounded border-brand-cream/50 text-brand-green focus:ring-brand-green/50"
                        />
                        <input
                          type="text"
                          value={note.text}
                          onChange={(e) => {
                            const updatedNotes = [...notes];
                            updatedNotes[index].text = e.target.value;
                            setNotes(updatedNotes);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              setNotes([
                                ...notes,
                                { text: "", checked: false },
                              ]);
                              setTimeout(() => {
                                const inputs =
                                  document.querySelectorAll<HTMLInputElement>(
                                    ".checklist-input"
                                  );
                                inputs[inputs.length - 1]?.focus();
                              }, 0);
                            }
                          }}
                          placeholder="Add a checklist item..."
                          className="flex-1 bg-transparent border-0 focus:ring-0 text-brand-cream placeholder-brand-cream/50 checklist-input"
                        />
                        <button
                          onClick={() => {
                            const updatedNotes = notes.filter(
                              (_, i) => i !== index
                            );
                            setNotes(updatedNotes.length ? updatedNotes : []);
                          }}
                          className="text-brand-cream/80 hover:text-brand-cream"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-brand-cream">
                    Title
                  </h3>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title..."
                  className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0"
                />
              </div>

              {/* Colors and Due Date Section - Styled like the sidebar but integrated */}
              <div className="bg-brand-green-dark/20 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Colors Grid */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-brand-cream flex items-center gap-2">
                      <FaPalette />
                      <span>Colours</span>
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(COLOR_OPTIONS).map(([name, color]) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
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

                  {/* Due Date Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-brand-cream flex items-center gap-2">
                      <FaCalendar />
                      <span>Due Date</span>
                    </h3>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full p-2 rounded-lg bg-brand-green-dark/30 text-brand-cream border-0 focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-brand-cream">
                  Notes
                </h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0 min-h-[100px]"
                  placeholder="Add some extra notes..."
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout (lg screens and up) - Original layout */}
          <div className="hidden lg:block p-6 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-cream">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-brand-cream mb-2">
                  Create New Action
                </h2>
                <div className="h-1 w-20 bg-brand-cream rounded"></div>
              </div>
              <button
                onClick={handleClose}
                className="text-brand-cream hover:text-brand-cream/80"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Column Selector */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-brand-cream">
                  Select Column
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(COLUMN_OPTIONS).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setCurrentColumn(value)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentColumn === value
                          ? "bg-brand-green text-brand-cream"
                          : "bg-brand-green-dark/20 text-brand-cream/80 hover:bg-brand-green/20"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Selector */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-brand-cream">
                  Priority
                </h3>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(
                      e.target.value as (typeof PRIORITY_OPTIONS)[number]
                    )
                  }
                  className="w-1/2 p-2 rounded-lg bg-brand-green-dark/20 text-brand-cream border-0 focus:ring-0 cursor-pointer"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="bg-brand-green text-brand-cream"
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-brand-cream">
                  Title
                </h3>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title..."
                  className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0"
                />
              </div>

              {/* Tags Section */}
              {showTags && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-brand-cream flex items-center gap-2">
                    <FaTag />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full flex items-center gap-2"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.text}
                        <button onClick={() => removeTag(index)}>
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag.text}
                      onChange={(e) =>
                        setNewTag({ ...newTag, text: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newTag.text.trim()) {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1 p-2 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50"
                      placeholder="Add a tag (press Enter)"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-brand-green text-brand-cream rounded-lg hover:bg-brand-green-dark transition-colors"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>
              )}

              {/* Checklist Section */}
              {notes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-brand-cream flex items-center gap-2">
                    <FaCheckSquare />
                    Checklist
                  </h3>
                  <div className="space-y-3">
                    {notes.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-brand-cream border-b border-brand-cream/20 pb-2"
                      >
                        <input
                          type="checkbox"
                          checked={note.checked}
                          onChange={() => toggleChecked(index)}
                          className="w-4 h-4 rounded border-brand-cream/50 text-brand-green focus:ring-brand-green/50"
                        />
                        <input
                          type="text"
                          value={note.text}
                          onChange={(e) => {
                            const updatedNotes = [...notes];
                            updatedNotes[index].text = e.target.value;
                            setNotes(updatedNotes);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              setNotes([
                                ...notes,
                                { text: "", checked: false },
                              ]);
                              setTimeout(() => {
                                const inputs =
                                  document.querySelectorAll<HTMLInputElement>(
                                    ".checklist-input"
                                  );
                                inputs[inputs.length - 1]?.focus();
                              }, 0);
                            }
                          }}
                          placeholder="Add a checklist item..."
                          className="flex-1 bg-transparent border-0 focus:ring-0 text-brand-cream placeholder-brand-cream/50 checklist-input"
                        />
                        <button
                          onClick={() => {
                            const updatedNotes = notes.filter(
                              (_, i) => i !== index
                            );
                            setNotes(updatedNotes.length ? updatedNotes : []);
                          }}
                          className="text-brand-cream/80 hover:text-brand-cream"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-brand-cream/60 mt-2 italic">
                    Press Enter to add another checklist item
                  </p>
                </div>
              )}

              {/* Description Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-brand-cream">
                  Notes
                </h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0 min-h-[100px]"
                  placeholder="Add some extra notes..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Only visible on large screens */}
        <div className="hidden lg:flex lg:w-48 bg-brand-green-dark/20 p-4 flex-col">
          <button
            onClick={notes.length === 0 ? addNewChecklist : removeAllChecklist}
            className={`flex items-center gap-2 mt-2 rounded-lg transition-colors ${
              notes.length > 0
                ? "bg-brand-green text-brand-cream p-2"
                : "text-brand-cream/80 hover:bg-brand-green/20"
            }`}
          >
            <FaList />
            {notes.length === 0 ? "Add Checklist" : "Remove Checklist"}
          </button>

          <button
            onClick={() => setShowTags(!showTags)}
            className={`flex items-center gap-2 mt-4 rounded-lg transition-colors ${
              showTags
                ? "bg-brand-green text-brand-cream p-2"
                : "text-brand-cream/80 hover:bg-brand-green/20"
            }`}
          >
            <FaTag />
            Add Tags
          </button>

          {/* Colors Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-brand-cream flex items-center gap-2 mt-4">
              <FaPalette />
              Colours
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(COLOR_OPTIONS).map(([name, color]) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
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

          {/* Due Date Section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-brand-cream flex items-center gap-2">
              <FaCalendar />
              Due Date
            </h3>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 rounded-lg bg-brand-green-dark/20 text-brand-cream border-0 focus:ring-0"
            />
          </div>
        </div>

        {/* Footer with Save Button - Different styles for mobile/tablet vs desktop */}
        <div className="lg:absolute lg:bottom-6 lg:right-6 flex flex-row lg:flex-col justify-end p-4 lg:p-0 gap-2 bg-brand-green-dark/10 lg:bg-transparent border-t border-brand-green-dark/20 lg:border-0">
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-lg border border-brand-cream text-brand-cream hover:bg-brand-cream/10 transition-colors lg:w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!currentColumn}
            className={`px-6 py-2 rounded-lg transition-colors lg:w-full ${
              !currentColumn
                ? "bg-brand-green/50 text-brand-cream/50 cursor-not-allowed"
                : "bg-brand-green text-brand-cream hover:bg-brand-green-dark"
            }`}
          >
            Create Action
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default AddActionModal;
