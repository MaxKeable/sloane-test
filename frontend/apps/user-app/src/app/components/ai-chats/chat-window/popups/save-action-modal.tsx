import React, { useState, useRef, useEffect, useCallback } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FaArrowsAltH } from "react-icons/fa";
import { Markdown } from "../messages/markdown";
import { showSuccessToast } from "../../../Toast/SuccessToast";
import {
  ModalHeader,
  ColumnSelector,
  PrioritySelector,
  TitleInput,
  TagsSection,
  ChecklistSection,
  NotesSection,
  SloaneChatSection,
  Sidebar,
} from "../save-action-modal-components";

interface SaveActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
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
  text: string;
  selectedColumn: string;
  isEditing?: boolean;
  initialData?: {
    title: string;
    notes: string[];
    colour: string;
    dueDate: string;
    tags: string[];
    description: string;
    priority: string;
  };
  hideSloaneChatSection?: boolean;
}

interface Note {
  id: string;
  text: string;
  checked: boolean;
}

export function SaveActionModal({
  isOpen,
  onClose,
  onSave,
  text: initialText,
  selectedColumn: initialColumn,
  isEditing = false,
  initialData,
  hideSloaneChatSection = false,
}: SaveActionModalProps) {
  // State management
  const [text] = useState(initialText);
  const [title, setTitle] = useState(initialData?.title || "");
  const [notes, setNotes] = useState<Note[]>(
    initialData?.notes.map((note) => ({
      id: note,
      text: note,
      checked: false,
    })) || []
  );
  const [, setShowColors] = useState(false);
  const [showTags, setShowTags] = useState<boolean>(
    Boolean(initialData?.tags && initialData.tags.length > 0)
  );
  const [selectedColor, setSelectedColor] = useState(initialData?.colour || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [tags, setTags] = useState<Array<{ text: string; color: string }>>(
    initialData?.tags.map((tag) => ({ text: tag, color: "#FFE5A5" })) || []
  );
  const [newTag, setNewTag] = useState({ text: "", color: "#FFE5A5" });
  const [, setIsColorDropdownOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(initialColumn);
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [priority, setPriority] = useState(initialData?.priority || "None");
  const [modalWidth, setModalWidth] = useState(800);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);
  const markdownRef = useRef<HTMLDivElement>(null);
  const hiddenMarkdownRef = useRef<HTMLDivElement>(null);

  // Event handlers
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = modalWidth;
  };

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX.current;
      const newWidth = Math.max(
        800,
        Math.min(1200, dragStartWidth.current + deltaX)
      );
      setModalWidth(newWidth);
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const addNewChecklist = () => {
    const newId = Date.now().toString();
    setNotes([...notes, { id: newId, text: "", checked: false }]);
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
    setIsColorDropdownOpen(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSubmit = async () => {
    await onSave({
      title: title ?? "Untitled Action",
      text,
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

  const handleCopyMarkdown = () => {
    if (hiddenMarkdownRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(hiddenMarkdownRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand("copy");
      selection?.removeAllRanges();
      showSuccessToast("Text copied to clipboard!", true, "copy");
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "90%", md: "90%", lg: modalWidth },
          bgcolor: "#4b8052",
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: "90vh",
          height: "90vh",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {/* Drag handle */}
        <div
          className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-cream rounded-lg cursor-ew-resize shadow-lg hover:bg-brand-cream/90 transition-colors group flex items-center justify-center"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center justify-center w-full h-full">
            <FaArrowsAltH className="text-brand-green-dark text-lg" />
          </div>
          <div className="absolute left-full ml-2 px-2 py-1 bg-brand-green text-brand-cream text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Expand Wider
          </div>
        </div>

        {/* Hidden markdown container */}
        <div
          ref={hiddenMarkdownRef}
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            width: "100%",
            background: "#fff",
          }}
          className="[&_*]:!text-black [&_*]:!bg-white [&_table]:border-black [&_td]:border-black [&_th]:border-black [&_h1]:!text-black [&_h2]:!text-black [&_h3]:!text-black [&_p]:!text-black [&_li]:!text-black [&_ul]:!text-black [&_ol]:!text-black [&_strong]:!text-black [&_em]:!text-black"
        >
          <Markdown
            data={initialText}
            themeOverride="light"
            markdownClassesProps="text-black"
          />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-cream">
          {/* Mobile layout */}
          <div className="lg:hidden p-6">
            <ModalHeader isEditing={isEditing} onClose={handleClose} />
            <div className="space-y-6">
              <ColumnSelector
                currentColumn={currentColumn}
                onColumnChange={setCurrentColumn}
                isMobile
              />
              <div className="flex flex-col gap-3">
                <PrioritySelector
                  priority={priority}
                  onPriorityChange={setPriority}
                  isMobile
                />
                {showTags && (
                  <TagsSection
                    tags={tags}
                    newTag={newTag}
                    onNewTagChange={setNewTag}
                    onAddTag={addTag}
                    onRemoveTag={removeTag}
                    isMobile={true}
                  />
                )}
              </div>
              <TitleInput title={title} onTitleChange={setTitle} />
              {notes.length > 0 && (
                <ChecklistSection
                  notes={notes}
                  onNoteChange={(index, text) => {
                    const updatedNotes = [...notes];
                    updatedNotes[index].text = text;
                    setNotes(updatedNotes);
                  }}
                  onToggleChecked={toggleChecked}
                  onRemoveNote={(index) => {
                    const updatedNotes = notes.filter((_, i) => i !== index);
                    setNotes(updatedNotes);
                  }}
                  onAddNote={addNewChecklist}
                />
              )}
              <NotesSection
                description={description}
                onDescriptionChange={setDescription}
              />
              {!hideSloaneChatSection && (
                <SloaneChatSection
                  initialText={initialText}
                  onCopyMarkdown={handleCopyMarkdown}
                  markdownRef={markdownRef}
                />
              )}
              {/* Sidebar below SloaneChatSection on mobile */}
              <Sidebar
                notes={notes}
                showTags={showTags}
                selectedColor={selectedColor}
                dueDate={dueDate}
                onAddChecklist={addNewChecklist}
                onRemoveChecklist={removeAllChecklist}
                onToggleTags={() => {
                  setShowTags(!showTags);
                  setShowColors(false);
                  setIsColorDropdownOpen(false);
                }}
                onColorSelect={setSelectedColor}
                onDueDateChange={setDueDate}
                isEditing={isEditing}
                onCancel={handleClose}
                onSubmit={handleSubmit}
                sloaneText={text}
                className="w-full mt-6"
              />
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:block p-6 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-cream">
            <ModalHeader isEditing={isEditing} onClose={handleClose} />
            <div className="space-y-6">
              <ColumnSelector
                currentColumn={currentColumn}
                onColumnChange={setCurrentColumn}
              />
              <PrioritySelector
                priority={priority}
                onPriorityChange={setPriority}
              />
              <TitleInput title={title} onTitleChange={setTitle} />
              {showTags && (
                <TagsSection
                  tags={tags}
                  newTag={newTag}
                  onNewTagChange={setNewTag}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                  isMobile={false}
                />
              )}
              {notes.length > 0 && (
                <ChecklistSection
                  notes={notes}
                  onNoteChange={(index, text) => {
                    const updatedNotes = [...notes];
                    updatedNotes[index].text = text;
                    setNotes(updatedNotes);
                  }}
                  onToggleChecked={toggleChecked}
                  onRemoveNote={(index) => {
                    const updatedNotes = notes.filter((_, i) => i !== index);
                    setNotes(updatedNotes);
                  }}
                  onAddNote={addNewChecklist}
                />
              )}
              <NotesSection
                description={description}
                onDescriptionChange={setDescription}
              />
              {!hideSloaneChatSection && (
                <SloaneChatSection
                  initialText={initialText}
                  onCopyMarkdown={handleCopyMarkdown}
                  markdownRef={markdownRef}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar on the right for desktop */}
        <Sidebar
          notes={notes}
          showTags={showTags}
          selectedColor={selectedColor}
          dueDate={dueDate}
          onAddChecklist={addNewChecklist}
          onRemoveChecklist={removeAllChecklist}
          onToggleTags={() => {
            setShowTags(!showTags);
            setShowColors(false);
            setIsColorDropdownOpen(false);
          }}
          onColorSelect={setSelectedColor}
          onDueDateChange={setDueDate}
          isEditing={isEditing}
          onCancel={handleClose}
          sloaneText={text}
          onSubmit={handleSubmit}
          className="h-full hidden lg:flex lg:w-48"
        />
      </Box>
    </Modal>
  );
}
