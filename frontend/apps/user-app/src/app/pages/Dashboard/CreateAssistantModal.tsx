import { useUser, useAuth } from "@clerk/clerk-react";
import { useAssistants } from "../../../hooks/useAssistants";
import { useState, useEffect, useCallback } from "react";
import { service } from "../../../services";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  FaTimes,
  FaPlus,
  FaList,
  FaSync,
  FaSpinner,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import useMediaQuery from "@mui/material/useMediaQuery";
import { toast } from "react-hot-toast";
import { IAssistant, ICreateAssistantValues } from "../../../types/interfaces";

interface CreateAssistantModalProps {
  isOpen: boolean;
  closeModal: () => void;
  isEdit?: boolean;
  assistantData?: IAssistant;
}

interface FormDataType {
  _id?: string;
  name: string;
  image: string;
  description: string;
  basePrompt: string;
  prompts: { display: string; prompt: string; _id?: string }[];
  user: string;
  relatedAssistants?: string[];
}

export default function CreateAssistantModal({
  isOpen,
  closeModal,
  isEdit = false,
  assistantData,
}: CreateAssistantModalProps) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { assistants, setAssistants } = useAssistants();
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    image: "https://picsum.photos/id/237/200/300",
    description: "",
    basePrompt: "",
    prompts: [{ display: "", prompt: "" }],
    user: user?.id || "",
    relatedAssistants: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add media query for responsive design
  const isMobile = useMediaQuery("(max-width:768px)");

  // Initialize form with assistant data if in edit mode
  useEffect(() => {
    if (isEdit && assistantData) {
      setFormData({
        _id: assistantData._id,
        name: assistantData.name || "",
        image: assistantData.image || "https://picsum.photos/id/237/200/300",
        description: assistantData.description || "",
        basePrompt: assistantData.basePrompt || "",
        prompts:
          assistantData.prompts && assistantData.prompts.length > 0
            ? assistantData.prompts
            : [{ display: "", prompt: "" }],
        user: assistantData.user || user?.id || "",
        relatedAssistants: [],
      });

      // Show prompts section if the assistant has prompts
      if (assistantData.prompts && assistantData.prompts.length > 0) {
        setShowPrompts(true);
      }
    }
  }, [isEdit, assistantData, user?.id]);

  // Reset form to initial state - memoize with useCallback
  const resetForm = useCallback(() => {
    if (isEdit && assistantData) {
      // If editing, reset to the original assistant data
      setFormData({
        _id: assistantData._id,
        name: assistantData.name || "",
        image: assistantData.image || "https://picsum.photos/id/237/200/300",
        description: assistantData.description || "",
        basePrompt: assistantData.basePrompt || "",
        prompts:
          assistantData.prompts && assistantData.prompts.length > 0
            ? assistantData.prompts
            : [{ display: "", prompt: "" }],
        user: assistantData.user || user?.id || "",
        relatedAssistants: [],
      });
    } else {
      // If creating new, reset to empty form
      setFormData({
        name: "",
        image: "https://picsum.photos/id/237/200/300",
        description: "",
        basePrompt: "",
        prompts: [{ display: "", prompt: "" }],
        user: user?.id || "",
        relatedAssistants: [],
      });
    }
    setError(null);

    // Fix for the boolean | undefined error
    const hasPrompts =
      isEdit &&
      assistantData?.prompts !== undefined &&
      assistantData.prompts.length > 0;

    setShowPrompts(hasPrompts ? true : false);
  }, [isEdit, assistantData, user?.id]);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Custom toast with reload button
  const showReloadToast = () => {
    toast(
      (t) => (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-8 w-full max-w-[500px]">
          <span className="text-brand-green font-medium flex flex-col text-center sm:text-left mb-2 sm:mb-0">
            <span>
              We need to refresh the page to show your{" "}
              {isEdit ? "updated" : "new"} Ai Expert. Ready when you are!
            </span>
          </span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              window.location.reload();
            }}
            className="px-4 py-2 bg-brand-green text-brand-cream rounded-lg hover:bg-brand-green/90 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <FaSync className="animate-spin" />
            Reload Now
          </button>
        </div>
      ),
      {
        position: "top-center",
        duration: Infinity,
        style: {
          background: "var(--brand-cream, #Fdf3e3)",
          padding: "8px",
          width: "auto",
          maxWidth: "95%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        },
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();

      // Filter out empty prompts before sending to server
      const filteredPrompts = formData.prompts.filter(
        (prompt) => prompt.display.trim() !== "" && prompt.prompt.trim() !== ""
      );

      // Create the data object for API calls
      const apiData: ICreateAssistantValues = {
        name: formData.name,
        image: formData.image,
        description: formData.description,
        jobTitle: formData.name,
        basePrompt: formData.basePrompt,
        relatedAssistants: formData.relatedAssistants || [],
        createdBy: user?.id,
      };

      // Add user field for custom assistants
      const createData = {
        ...apiData,
        user: user?.id, // This is the field used for filtering custom assistants
      };

      let result: IAssistant;

      if (isEdit && formData._id) {
        // Update existing assistant
        // Add prompts to the update data
        const updateData = {
          ...createData,
          prompts: filteredPrompts,
        };

        // Debug logs
        console.log("Updating assistant with data:", {
          basePrompt: formData.basePrompt,
          updateData,
        });

        // Use assistantService instead of adminService for updating custom assistants
        result = await service.assistantService.updateAssistant(
          token,
          updateData,
          formData._id
        );

        // Log the result from the server
        console.log("Server response after update:", {
          basePrompt: result.basePrompt,
          prompts: result.prompts?.length || 0,
        });

        // Update the assistant in the local state
        setAssistants(
          assistants.map((a) => (a._id === result._id ? result : a))
        );

        toast(
          (t) => (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-8 w-full max-w-[500px]">
              <span className="text-brand-green font-medium flex flex-col text-center sm:text-left mb-2 sm:mb-0">
                <span>Your Ai Expert has been updated successfully!</span>
              </span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  // Show the reload toast after user clicks "Okay"
                  showReloadToast();
                }}
                className="px-4 py-2 bg-brand-green text-brand-cream rounded-lg hover:bg-brand-green/90 transition-colors w-full sm:w-auto"
              >
                Okay
              </button>
            </div>
          ),
          {
            position: "top-center",
            duration: Infinity,
            style: {
              background: "var(--brand-cream, #Fdf3e3)",
              padding: "8px",
              width: "auto",
              maxWidth: "95%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            },
          }
        );
      } else {
        // Create new assistant
        // Add prompts to the API data
        const finalData = {
          ...createData,
          prompts: filteredPrompts,
        };

        result = await service.assistantService.createAssistant(
          token,
          finalData
        );

        // Add the new assistant to the local state
        setAssistants([...assistants, result]);

        // Show first success toast with a callback for the reload toast
        toast(
          (t) => (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-8 w-full max-w-[500px]">
              <span className="text-brand-green font-medium flex flex-col text-center sm:text-left mb-2 sm:mb-0">
                <span>Awesome work! Your new Ai Expert has been created.</span>
              </span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  // Show the reload toast after user clicks "Okay"
                  showReloadToast();
                }}
                className="px-4 py-2 bg-brand-green text-brand-cream rounded-lg hover:bg-brand-green/90 transition-colors w-full sm:w-auto"
              >
                Okay
              </button>
            </div>
          ),
          {
            position: "top-center",
            duration: Infinity,
            style: {
              background: "var(--brand-cream, #Fdf3e3)",
              padding: "8px",
              width: "auto",
              maxWidth: "95%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            },
          }
        );
      }

      resetForm(); // Reset form after successful creation/update
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save assistant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromptChange = (
    index: number,
    field: "display" | "prompt",
    value: string
  ) => {
    const newPrompts = [...formData.prompts];
    newPrompts[index][field] = value;
    setFormData({ ...formData, prompts: newPrompts });
  };

  const addPrompt = () => {
    setFormData({
      ...formData,
      prompts: [...formData.prompts, { display: "", prompt: "" }],
    });
  };

  const deletePrompt = (index: number) => {
    // Show confirmation toast before deleting
    toast(
      (t) => (
        <div className="flex flex-col items-center gap-3 w-full max-w-[500px] bg-brand-cream p-5 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-1 w-full justify-center">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
            <span className="text-brand-green font-semibold text-lg">
              Delete this prompt?
            </span>
          </div>
          <p className="text-brand-green/80 text-center mb-4">
            Are you sure you want to delete this prompt? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 w-full justify-center">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-5 py-2 border border-brand-green text-brand-green rounded-lg hover:bg-brand-green/10 transition-colors font-medium min-w-[100px]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // User confirmed deletion
                const newPrompts = [...formData.prompts];
                newPrompts.splice(index, 1);

                // Always keep at least one prompt field
                if (newPrompts.length === 0) {
                  newPrompts.push({ display: "", prompt: "" });
                }

                setFormData({ ...formData, prompts: newPrompts });
                toast.dismiss(t.id);

                // Show success toast
                toast.success("Prompt deleted successfully", {
                  duration: 2000,
                  style: {
                    background: "var(--brand-cream, #Fdf3e3)",
                    color: "#4b8052",
                  },
                });
              }}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2 min-w-[100px] justify-center"
            >
              <FaTrash />
              Delete
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        duration: 5000,
        style: {
          background: "transparent",
          padding: "0",
          boxShadow: "none",
          border: "none",
        },
      }
    );
  };

  const handleDeleteAssistant = async () => {
    if (!isEdit || !formData._id) return;

    setIsDeleting(true);
    setError(null);

    try {
      const token = await getToken();
      await service.assistantService.deleteAssistant(token, formData._id);

      // Remove the assistant from the local state
      setAssistants(assistants.filter((a) => a._id !== formData._id));

      // Close the modal first
      closeModal();

      // Show success toast
      toast.success(
        (t) => (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-8 w-full max-w-[500px]">
            <span className="text-brand-green font-medium flex flex-col text-center sm:text-left mb-2 sm:mb-0">
              <span>Your Ai Expert has been deleted successfully!</span>
            </span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Show the reload toast after user clicks "Okay"
                showReloadToast();
              }}
              className="px-4 py-2 bg-brand-green text-brand-cream rounded-lg hover:bg-brand-green/90 transition-colors w-full sm:w-auto"
            >
              Okay
            </button>
          </div>
        ),
        {
          position: "top-center",
          duration: Infinity,
          style: {
            background: "var(--brand-cream, #Fdf3e3)",
            padding: "8px",
            width: "auto",
            maxWidth: "95%",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          },
        }
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete assistant"
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90%" : 800,
          bgcolor: "#4b8052",
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          overflow: "hidden",
        }}
      >
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-cream">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-brand-cream mb-2">
                {isEdit ? "Edit" : "Create"} An Ai Expert
              </h2>
              <div className="h-1 w-20 bg-brand-cream rounded"></div>
            </div>
            <button
              onClick={closeModal}
              className="text-brand-cream hover:text-brand-cream/80"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            id="assistantForm"
          >
            {error && (
              <div className="text-red-500 bg-red-100/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-brand-cream">
                Name
              </h3>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0"
                placeholder="Ai Expert's Name"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-brand-cream">
                Description
              </h3>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0 min-h-[100px]"
                placeholder="A quick description of the Ai Expert - this is what is shown when you click the little i icon on the Ai Experts"
                required
              />
            </div>

            {/* Base Prompt Input */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-brand-cream">
                Expert Description
              </h3>
              <textarea
                value={formData.basePrompt}
                onChange={(e) =>
                  setFormData({ ...formData, basePrompt: e.target.value })
                }
                className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0 min-h-[100px]"
                placeholder="Describe the role of this expert in a few sentences and we'll use this to create the propper prompt for Sloane"
                required
              />
            </div>

            {/* Prompts Section - Only show when showPrompts is true */}
            {showPrompts && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-brand-cream">
                  Additional Prompts
                </h3>
                <p className="text-sm text-brand-cream/70 mb-4">
                  These are the quick prompt buttons you use to click inside
                  each chat
                </p>
                {formData.prompts.map((prompt, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        value={prompt.display}
                        onChange={(e) =>
                          handlePromptChange(index, "display", e.target.value)
                        }
                        className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0"
                        placeholder="Button text (what users will see)"
                      />
                      <button
                        type="button"
                        onClick={() => deletePrompt(index)}
                        className="ml-2 p-2 rounded-lg bg-red-500/30 text-red-400 hover:bg-red-500/50 transition-colors group relative flex items-center justify-center"
                        aria-label="Delete prompt"
                      >
                        <FaTrash className="text-lg" />
                        <span className="absolute invisible group-hover:visible bg-brand-cream text-brand-green text-xs p-2 rounded-lg whitespace-nowrap -top-10 right-0 transform shadow-md border border-brand-green/20">
                          Delete this prompt
                        </span>
                      </button>
                    </div>
                    <textarea
                      value={prompt.prompt}
                      onChange={(e) =>
                        handlePromptChange(index, "prompt", e.target.value)
                      }
                      className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0 min-h-[100px]"
                      placeholder="Prompt text (what will be sent to Sloane)"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPrompt}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-brand-cream/80 hover:bg-brand-green/20 transition-colors"
                >
                  <FaPlus />
                  Add Prompt
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Sidebar - Converted to horizontal bar on mobile */}
        <div
          className={`${
            isMobile ? "w-full" : "w-48"
          } bg-brand-green-dark/20 p-4 flex ${
            isMobile ? "flex-row justify-between" : "flex-col"
          } gap-3`}
        >
          <button
            onClick={() => setShowPrompts(!showPrompts)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors group relative ${
              showPrompts
                ? "bg-brand-green text-brand-cream"
                : "text-brand-cream/80 hover:bg-brand-green/20"
            }`}
          >
            <FaList />
            {showPrompts ? "Hide Prompts" : "Add Prompts"}
            {/* Tooltip */}
            <div className="absolute invisible group-hover:visible bg-brand-green-dark text-brand-cream text-xs p-2 rounded-lg whitespace-nowrap -top-12 left-1/2 transform -translate-x-1/2">
              Add quick prompt buttons for your Ai Expert
            </div>
          </button>

          {/* Footer Buttons */}
          <div
            className={`${
              isMobile ? "flex flex-row" : "mt-auto flex flex-col"
            } gap-2`}
          >
            <button
              type="button"
              onClick={() => {
                resetForm();
                closeModal();
              }}
              className="px-6 py-2 rounded-lg border border-brand-cream text-brand-cream hover:bg-brand-cream/10 transition-colors"
              disabled={isSubmitting || isDeleting}
            >
              Cancel
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2 rounded-lg border border-red-400 text-red-400 hover:bg-red-400/10 transition-colors"
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className="animate-spin inline mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete Expert"
                )}
              </button>
            )}
            <button
              type="submit"
              form="assistantForm"
              disabled={isSubmitting || isDeleting}
              className="px-6 py-2 rounded-lg bg-brand-green text-brand-cream hover:bg-brand-green-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <FaSpinner className="animate-spin" />}
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Update Expert"
                  : "Create Expert"}
            </button>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
              <div className="bg-brand-cream p-6 rounded-lg max-w-md shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                  <h3 className="text-xl font-bold text-brand-green">
                    Delete AI Expert?
                  </h3>
                </div>
                <p className="text-brand-green/90 mb-6">
                  Are you sure you want to delete "
                  <span className="font-semibold">{formData.name}</span>"? This
                  action cannot be undone and all associated prompts will be
                  permanently removed.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-lg border border-brand-green text-brand-green hover:bg-brand-green/10 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAssistant}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                    disabled={isDeleting}
                  >
                    {isDeleting && <FaSpinner className="animate-spin" />}
                    {isDeleting ? "Deleting..." : "Delete Permanently"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
}

// Export a named component for the EditAssistantModal
export function EditAssistantModal({
  isOpen,
  closeModal,
  assistantData,
}: {
  isOpen: boolean;
  closeModal: () => void;
  assistantData: IAssistant;
}) {
  return (
    <CreateAssistantModal
      isOpen={isOpen}
      closeModal={closeModal}
      isEdit={true}
      assistantData={assistantData}
    />
  );
}
