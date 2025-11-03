import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../../../context/theme-context";
import { useAuth } from "@clerk/clerk-react";
import { actionsService } from "../../../services/actionsService";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddIcon from "@mui/icons-material/Add";
import AddActionModal from "./AddActionModal";
import { FaCheckSquare, FaCalendarAlt, FaFileAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import SwipeIndicator from "./SwipeIndicator";
import FilterBar from "./FilterBar";
import PageWrapper from "@/app/components/core/page-wrapper";

interface Note {
  id: string;
  text: string;
  timestamp: Date;
  checked: boolean;
}

interface Action {
  _id: string;
  title: string;
  text: string;
  column: string;
  chatId?: string;
  messageId?: string;
  assistantId?: string;
  notes: Note[];
  colour: string;
  dueDate?: string;
  description?: string;
  priority?: string;
  status?: string;
  tags?: string[];
}

interface ColumnProps {
  title: string;
  columnId: string;
  actions: Action[];
  onDrop: (actionId: string, column: string) => Promise<void>;
  className: string;
  titleClassName: string;
  isLoading: boolean;
  onActionClick: (action: Action) => void;
  onDeleteAction: (actionId: string) => Promise<void>;
  userId: string;
  onRefresh: () => Promise<void>;
}

interface FilterOptions {
  colors: string[];
  tags: string[];
  priorities: string[];
}

// Draggable Action Item Component
const ActionItem = ({
  action,
  onDragEnd,
  onClick,
  onDelete,
}: {
  action: Action;
  onDragEnd: (actionId: string, column: string) => Promise<void>;
  onClick: () => void;
  onDelete: () => Promise<void>;
}) => {
  const { theme } = useTheme();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "action",
    item: { id: action._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast(
      (t) => (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-8 w-full max-w-[500px]">
          <span className="text-brand-green font-medium flex flex-col text-center sm:text-left mb-2 sm:mb-0">
            <span>Are you sure you want to delete this?</span>
            <span className="text-sm opacity-80">This can't be undone.</span>
          </span>
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onDelete();
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 bg-red-500 text-brand-cream rounded-lg hover:bg-red-600 transition-colors w-full"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-brand-green text-brand-cream rounded-lg hover:bg-brand-green/90 transition-colors w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        duration: Infinity,
        style: {
          background: "var(--brand-cream, #Fdf3e3)",
          padding: "16px",
          width: "auto",
          maxWidth: "95%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        },
      }
    );
  };

  return (
    // =====================================================================
    // ⬇️⬇️⬇️ ACTION CARD STYLING - MAIN CONTAINER STARTS HERE ⬇️⬇️⬇️
    // =====================================================================
    <div
      ref={drag as any}
      onClick={onClick}
      style={{
        // 🎨 CARD BACKGROUND COLOR - Edit this to change the card background
        backgroundColor:
          action.colour || (theme === "dark" ? "#10B981" : "#F5F5DC"),
        position: "relative",
      }}
      // 🎨 CARD CONTAINER STYLING - Edit these classes to change the card appearance
      className={`p-3 rounded-lg mb-2 cursor-pointer border-[1px] shadow-md border-brand-green-dark/30 ${
        isDragging ? "opacity-50" : "opacity-100"
      } text-brand-green-dark ${
        // Add adaptive height based on content
        !action.tags?.length &&
        !action.notes.length &&
        !action.description &&
        !action.dueDate
          ? "min-h-[60px] flex items-center"
          : "min-h-[80px]"
      }`}
    >
      <div className="flex justify-between items-start w-full">
        <div className="flex-1">
          {/* Tags section with conditional margin */}
          {action.tags && action.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {action.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-brand-green-dark/70 text-xs px-2 py-0.5 rounded-full shadow-sm border border-brand-green-dark/20 bg-brand-green-dark/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {/* Title with conditional margin */}
          <h3
            className={`font-Quicksand text-brand-green-dark text-[14px] lg:text-[16px] leading-none lg:leading-tight ${
              action.tags && action.tags.length > 0 ? "mt-3" : "mt-0"
            }`}
          >
            {action.title}
          </h3>
          {/* Metadata section */}
          {(action.notes.length > 0 ||
            action.description ||
            action.dueDate) && (
            <div className="flex items-center gap-3 text-xs text-brand-green-dark/70 mt-1">
              {action.notes.length > 0 && (
                <div className="flex items-center gap-1">
                  <FaCheckSquare />
                  <span>{action.notes.length}</span>
                </div>
              )}
              {action.description && (
                <div className="flex items-center gap-1">
                  <FaFileAlt />
                </div>
              )}
              {action.dueDate && (
                <div className="flex items-center gap-1">
                  <FaCalendarAlt />
                  <span>{new Date(action.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}
          {/* Priority badge */}
          {action.priority && (
            <div className="absolute bottom-2 right-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  action.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : action.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {action.priority}
              </span>
            </div>
          )}
        </div>
        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="text-brand-green-dark hover:text-red-700 p-1 ml-1 -mt-2"
        >
          <IoClose className="text-sm" />
        </button>
      </div>
    </div>
    // =====================================================================
    // ⬆️⬆️⬆️ ACTION CARD STYLING - MAIN CONTAINER ENDS HERE ⬆️⬆️⬆️
    // =====================================================================
  );
};

// Droppable Column Component
const Column: React.FC<ColumnProps> = ({
  title,
  columnId,
  actions,
  onDrop,
  className,
  titleClassName,
  isLoading,
  onActionClick,
  onDeleteAction,
  userId,
  onRefresh,
}) => {
  const { getToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "action",
    drop: (item: { id: string }) => {
      onDrop(item.id, columnId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Calculate if we need scrolling based on number of actions
  // Few items = auto height, many items = fixed height with scrolling
  const columnHeight = actions.length <= 3 ? "auto" : "100%";
  const minColumnHeight = "min-h-[200px]"; // Minimum height for visual consistency
  const maxColumnHeight = actions.length <= 3 ? "" : "max-h-full"; // Only apply max height if we have many items

  return (
    <div
      ref={drop as any}
      style={{ height: columnHeight }}
      className={`${className} ${
        isOver ? "bg-brand-cream bg-opacity-30" : ""
      } flex flex-col ${minColumnHeight} ${maxColumnHeight}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className={titleClassName}>{title}</h2>
          <span className="px-2 py-0.5 bg-brand-cream/20 text-brand-cream rounded-full text-sm">
            {actions.length}
          </span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="p-1 hover:bg-opacity-80 rounded-full"
        >
          <AddIcon className={titleClassName} />
        </button>
      </div>

      {/* Content area - scrollable only when needed */}
      <div
        className={`flex-1 overflow-y-auto pr-1 scrollbar-hide ${
          actions.length > 3 ? "overflow-y-auto" : "overflow-visible"
        }`}
      >
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-6 h-6 border-2 border-brand-cream border-t-transparent rounded-full"
              />
            </div>
          ) : actions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-32 text-brand-green-dark/60 text-sm"
            >
              <div className="mb-3 text-brand-green-dark/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p>No actions yet</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="mt-2 px-3 py-1 bg-brand-cream/20 hover:bg-brand-cream/30 text-brand-green-dark rounded-lg text-xs transition-colors"
              >
                Add your first action
              </motion.button>
            </motion.div>
          ) : (
            actions.map((action) => (
              <ActionItem
                key={action._id}
                action={action}
                onDragEnd={onDrop}
                onClick={() => onActionClick(action)}
                onDelete={() => onDeleteAction(action._id)}
              />
            ))
          )}
        </div>
      </div>

      <AddActionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (actionData) => {
          const token = await getToken();
          if (!token) return;

          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/api/actions/create`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  userId: userId,
                  ...actionData,
                  column: columnId,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to create action");
            }

            await onRefresh();
            setShowModal(false);
          } catch (error) {
            console.error("Error creating action:", error);
          }
        }}
        column={columnId}
      />
    </div>
  );
};

const Actions = () => {
  const { getToken, userId } = useAuth();
  const [actions, setActions] = useState<{
    idea: Action[];
    toDo: Action[];
    inProgress: Action[];
    complete: Action[];
  }>({
    idea: [],
    toDo: [],
    inProgress: [],
    complete: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    colors: [],
    tags: [],
    priorities: [],
  });
  const [activeFilters, setActiveFilters] = useState({
    colors: [] as string[],
    tags: [] as string[],
    priorities: [] as string[],
  });

  // Mobile column navigation state
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Animation direction state
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  const columnClass =
    "flex-1 bg-brand-cream bg-opacity-20 rounded-lg p-4 shadow-xl flex flex-col";
  const titleClass = `text-xl font-semibold mb-4 text-brand-green-dark`;

  // Column definitions for easier reference
  const columns = [
    { id: "idea", title: "Idea" },
    { id: "toDo", title: "To Do" },
    { id: "inProgress", title: "In Progress" },
    { id: "complete", title: "Complete" },
  ];

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine how many columns to show based on screen size
  const isMobile = windowWidth < 768;
  const isMedium = windowWidth >= 768 && windowWidth < 1024;
  const columnsPerView = isMobile ? 1 : isMedium ? 2 : 4;
  const maxNavigableIndex = columns.length - columnsPerView;

  // Get visible columns based on screen size and active index
  const getVisibleColumns = () => {
    if (isMobile) {
      return columns.slice(activeColumnIndex, activeColumnIndex + 1);
    } else if (isMedium) {
      return columns.slice(activeColumnIndex, activeColumnIndex + 2);
    } else {
      return columns;
    }
  };

  // Use useCallback to memoize these functions
  const fetchActions = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      setIsLoading(true);
      const columns = ["idea", "toDo", "inProgress", "complete"];
      const actionsByColumn: any = {};

      await Promise.all(
        columns.map(async (column) => {
          const columnActions = await actionsService.getActionsByUserAndColumn(
            token,
            column
          );
          actionsByColumn[column] = columnActions;
        })
      );

      setActions(actionsByColumn);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch actions");
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  const handleDrop = async (actionId: string, newColumn: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      await actionsService.updateActionColumn(token, actionId, newColumn);
      await fetchActions(); // Refresh all columns
    } catch (error) {
      console.error("Error updating action column:", error);
      // Optionally show error message to user
    }
  };

  const handleActionClick = (action: Action) => {
    setSelectedAction(action);
  };

  const handleDeleteAction = async (actionId: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      await actionsService.deleteAction(token, actionId);
      await fetchActions();
    } catch (error) {
      console.error("Error deleting action:", error);
    }
  };

  const fetchFilterOptions = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token || !userId) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/actions/user-filters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User-ID": userId,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch filter options");
      }

      const data = await response.json();
      setFilterOptions({
        colors: data.colors || [],
        tags: data.tags || [],
        priorities: data.priorities || [],
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  }, [getToken, userId]);

  // Update useEffect to include goals fetching
  useEffect(() => {
    const fetchData = async () => {
      await fetchActions();
      await fetchFilterOptions();
    };
    fetchData();

    // Add event listener for action creation
    const handleActionCreated = () => {
      fetchActions();
    };
    window.addEventListener("actionCreated", handleActionCreated);

    return () => {
      window.removeEventListener("actionCreated", handleActionCreated);
    };
  }, [fetchActions, fetchFilterOptions]);

  // Add this helper function to filter actions
  const filterActions = (actions: Action[]) => {
    return actions.filter((action) => {
      // If no filters are active, show all actions
      if (
        activeFilters.colors.length === 0 &&
        activeFilters.tags.length === 0 &&
        activeFilters.priorities.length === 0
      ) {
        return true;
      }

      // Check if action matches any active color filter
      const matchesColor =
        activeFilters.colors.length === 0 ||
        activeFilters.colors.includes(action.colour);

      // Check if action matches any active tag filter
      const matchesTags =
        activeFilters.tags.length === 0 ||
        action.tags?.some((tag) => activeFilters.tags.includes(tag));

      // Check if action matches any active priority filter
      const matchesPriority =
        activeFilters.priorities.length === 0 ||
        activeFilters.priorities.includes(action.priority || "None");

      return matchesColor && matchesTags && matchesPriority;
    });
  };

  // Function to navigate to the next column on mobile/medium screens
  const navigateToNextColumn = () => {
    if (activeColumnIndex < maxNavigableIndex) {
      // Set animation direction
      setSlideDirection("left");
      // Move one column at a time
      const nextIndex = Math.min(activeColumnIndex + 1, maxNavigableIndex);
      setActiveColumnIndex(nextIndex);
      scrollToColumn(nextIndex);
    }
  };

  // Function to navigate to the previous column on mobile/medium screens
  const navigateToPrevColumn = () => {
    if (activeColumnIndex > 0) {
      // Set animation direction
      setSlideDirection("right");
      // Move one column at a time
      const prevIndex = Math.max(activeColumnIndex - 1, 0);
      setActiveColumnIndex(prevIndex);
      scrollToColumn(prevIndex);
    }
  };

  // Function to directly navigate to a specific column
  const navigateToColumn = (index: number) => {
    // Set animation direction based on navigation
    setSlideDirection(index > activeColumnIndex ? "left" : "right");
    const boundedIndex = Math.min(index, maxNavigableIndex);
    setActiveColumnIndex(boundedIndex);
    scrollToColumn(boundedIndex);
  };

  // Function to scroll to a specific column
  const scrollToColumn = (index: number) => {
    // With our new approach, we don't need to scroll the container
    // We just update the activeColumnIndex and let React re-render
    // the visible columns
    setActiveColumnIndex(index);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeColumnIndex < maxNavigableIndex) {
      navigateToNextColumn();
    }
    if (isRightSwipe && activeColumnIndex > 0) {
      navigateToPrevColumn();
    }
  };

  // Add mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const onMouseUp = () => {
    setIsDragging(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeColumnIndex < maxNavigableIndex) {
      navigateToNextColumn();
    }
    if (isRightSwipe && activeColumnIndex > 0) {
      navigateToPrevColumn();
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <PageWrapper title="Action Plan">
      <DndProvider backend={HTML5Backend}>
        <div className="flex bg-brand-green w-full">
          <div className="w-full transition-all duration-300">
            {/* Scrollable content - add the actions-scroll class */}
            <div className="h-[calc(100vh-100px)]">
              {/* Desktop Filter Bar - only visible on large screens */}
              <div className="hidden lg:block mb-4">
                <FilterBar
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  filterOptions={filterOptions}
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                />
              </div>

              {/* Mobile/Medium navigation - only visible on screens smaller than large */}
              <div className="lg:hidden flex items-center justify-between gap-4 mb-4">
                <div className="w-full">
                  <FilterBar
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    filterOptions={filterOptions}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                  />
                </div>
              </div>

              {/* Swipe gesture indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-brand-green-dark/70 -mt-4 mb-2 justify-center lg:hidden"
              >
                <SwipeIndicator />
              </motion.div>

              {/* Columns container with swipe functionality */}
              <div className="min-h-[calc(100vh-160px)] flex">
                <div
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  className={`flex flex-1 gap-4 relative touch-pan-x ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                  }`}
                >
                  <AnimatePresence
                    initial={false}
                    custom={slideDirection}
                    mode="popLayout"
                  >
                    <motion.div
                      key={activeColumnIndex}
                      className="flex flex-1 gap-4 absolute inset-0 h-full"
                      custom={slideDirection}
                      variants={{
                        enter: (direction) => ({
                          x: direction === "left" ? "100%" : "-100%",
                          opacity: 0,
                          scale: 0.95,
                        }),
                        center: {
                          x: 0,
                          opacity: 1,
                          scale: 1,
                          transition: {
                            x: { type: "spring", stiffness: 400, damping: 30 },
                            opacity: { duration: 0.2 },
                            scale: {
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            },
                          },
                        },
                        exit: (direction) => ({
                          x: direction === "left" ? "-100%" : "100%",
                          opacity: 0,
                          scale: 0.95,
                          position: "absolute",
                          transition: {
                            x: { type: "spring", stiffness: 400, damping: 30 },
                            opacity: { duration: 0.2 },
                            scale: {
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            },
                          },
                        }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      {getVisibleColumns().map((column) => (
                        <motion.div
                          key={column.id}
                          className={`
                          flex-1
                          ${isMedium ? "w-1/2" : ""}
                        `}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.1,
                            duration: 0.3,
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                        >
                          <Column
                            title={column.title}
                            columnId={column.id}
                            actions={filterActions(
                              actions[column.id as keyof typeof actions]
                            )}
                            onDrop={handleDrop}
                            className={columnClass}
                            titleClassName={titleClass}
                            isLoading={isLoading}
                            onActionClick={handleActionClick}
                            onDeleteAction={handleDeleteAction}
                            userId={userId || ""}
                            onRefresh={fetchActions}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Pagination indicators - only visible on screens smaller than large */}
              <div className="lg:hidden flex justify-between items-center mt-4">
                <div className="flex gap-2 justify-center w-full">
                  {columns.map((_, index) => {
                    if (index > maxNavigableIndex) return null;
                    const isActive = isMedium
                      ? index === activeColumnIndex
                      : index === activeColumnIndex;
                    return (
                      <motion.button
                        key={index}
                        onClick={() => navigateToColumn(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-brand-cream"
                            : "bg-brand-cream bg-opacity-30"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        animate={isActive ? { scale: 1.25 } : { scale: 1 }}
                        aria-label={`Go to ${
                          isMedium && index < columns.length - 1
                            ? `${columns[index].title} + ${
                                columns[index + 1].title
                              }`
                            : columns[index].title
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </PageWrapper>
  );
};

export default Actions;
