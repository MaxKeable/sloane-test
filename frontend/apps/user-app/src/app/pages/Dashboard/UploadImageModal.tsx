import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FaTimes } from "react-icons/fa";

interface formDataT {
  title: string;
  description: string;
  tags: string[];
}

export interface Image {
  _id: string;
  tags: string[];
  title: string;
  description: string;
  imageUrl: string;
  imageName: string;
  imageSize: number;
  createdAt: string;
  isSkeleton: boolean;
}

interface UploadImageModalProps {
  isOpen: boolean;
  isEditImage: boolean;
  selectedImage: Image | null;
  onClose: () => void;
  onUpload: (file: File, formData: formDataT) => void;
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({ isOpen, isEditImage, selectedImage, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      tag: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (selectedImage) {
      reset({
        title: selectedImage.title,
        description: selectedImage.description,
        tag: "",
      });
      setTags(selectedImage.tags || [])
    }
  }, [selectedImage, reset]);

  const handleOnClose = () => {
    onClose();
    setSelectedFile(null);
    reset({
      title: "",
      description: "",
      tag: "",
    });
    setTags([])
  };

  const onSubmit = (data: any) => {
    if (selectedFile || selectedImage) {
      const body = {
        ...data,
        tags: tags,
      }
      onUpload(selectedFile as File, body);
      console.log(body);
      setSelectedFile(null);
      handleOnClose();
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (event.key === "Enter" && event.currentTarget.value.trim()) {
      const newTag = event.currentTarget.value.trim();
      setTags((prevTags) => [...prevTags, newTag]);
      field.onChange([]);
      event.currentTarget.value = "";
      event.preventDefault();
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    // Update the form state with the new tags array
  };
  if (!isOpen) return null;

  console.log("!selectedFile &&  !selectedImage?.imageName :>> ", !selectedFile && !selectedImage?.imageName);

  return (
    <Modal open={isOpen} onClose={handleOnClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#4b8052",
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: "80vh",
          display: "flex",
          width: "95%",
          maxWidth: 600,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full overflow-auto p-8 mindfulness-modal-scroll">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-brand-cream mb-2 mt-0">{isEditImage ? "Edit" : "Upload"} Image</h2>
              <div className="h-1 w-20 bg-brand-cream rounded"></div>
            </div>
            <button onClick={handleOnClose} className="text-brand-cream hover:text-brand-cream/80">
              <FaTimes size={20} />
            </button>
          </div>

          <div
            {...getRootProps()}
            className="border-dashed border-2 border-brand-cream p-4 text-center cursor-pointer rounded-md"
          >
            <input {...getInputProps()} />
            {selectedFile?.name || selectedImage?.imageName ? (
              <p className="text-brand-cream/80 text-base font-medium">{selectedFile?.name || selectedImage?.imageName}</p>
            ) : (
              <p className="text-brand-cream/60 text-base">Drag and drop an image here, or click to select a file</p>
            )}
          </div>

          <div className="mt-4">
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Title"
                  className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0"
                />
              )}
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>

          <div className="mt-4">
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Description"
                  className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0"
                />
              )}
            />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>

          <div className="mt-4">
            <Controller
              name="tag"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    placeholder="Press Enter to add tags"
                    className="w-full p-4 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50 border-0 focus:ring-0"
                    onKeyDown={(e) => handleKeyDown(e, field)}
                  />

                  <div className="flex flex-wrap mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-brand-cream text-[#4b8052] rounded-full px-3 py-1 mr-2 mb-2 flex items-center leading-none"
                      >
                        {tag}
                        <button type="button" className="ml-2 mt-1 text-red-500 hover:text-red-700" onClick={() => removeTag(index)}>
                          <FaTimes size={15} />
                        </button>
                      </span>
                    ))}
                  </div>
                </>
              )}
            />
          </div>

          <div className="flex justify-end flex-wrap gap-5 mt-8">
            <button
              className="px-8 py-2 rounded-lg border border-brand-cream text-brand-cream hover:bg-brand-cream/10 transition-colors"
              onClick={handleOnClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-8 py-2 rounded-lg ${
                selectedFile || selectedImage?.imageName
                  ? "bg-brand-cream  hover:bg-brand-cream/50"
                  : "bg-brand-cream/50 cursor-not-allowed"
              } text-[#4b8052] transition-colors`}
              disabled={!selectedFile && !selectedImage?.imageName}
            >
              {isEditImage ? "Edit" : "Upload"}
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default UploadImageModal;
