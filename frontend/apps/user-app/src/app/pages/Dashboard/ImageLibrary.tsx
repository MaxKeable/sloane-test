import { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Box, Skeleton, Modal } from "@mui/material";
import {
  FaUpload,
  FaTimes,
  FaChevronDown,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  MdDelete,
  MdDownload,
  MdEdit,
  MdFilterList,
  MdClose,
} from "react-icons/md";
import Sidebar from "../../components/Sidebar/side-bar";
import fetcher from "../../../utils/fetcher";
import DeleteImageModal from "./DeleteImageModal";
import toast from "react-hot-toast";
import UploadImageModal from "./UploadImageModal";

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

function ImageLibrary() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const isAdmin = user?.publicMetadata?.account === "admin";
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteAllImages, setIsDeleteAllImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image[] | null>(null);
  const [isEditImage, setIsEditImage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tag filtering state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // Add state to track loaded images
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Add state for image viewer modal
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetcher("/api/stock-images/images");
      if (response.data.success) {
        const imagesData = response.data.images?.map((image: Image) => ({
          ...image,
          isSkeleton: false,
        }));
        setImages(imagesData);

        // Preload images after setting state
        preloadImages(imagesData);

        // Extract all unique tags from images
        const allTags = imagesData.flatMap((img: Image) => img.tags || []);
        const uniqueTags = Array.from(new Set<string>(allTags));
        setAvailableTags(uniqueTags);
      } else {
        setError("Failed to fetch images");
      }
    } catch (err) {
      console.error("Error fetching images:", err);
      setError(
        err instanceof Error ? err.message : "Error connecting to server"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user, fetchImages]);

  // Filter images based on selected tags
  const filteredImages =
    selectedTags.length > 0
      ? images.filter((image) =>
          selectedTags.every((tag) => image.tags?.includes(tag))
        )
      : images;

  // Add a tag to the filter
  const addTagFilter = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Remove a tag from the filter
  const removeTagFilter = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // Clear all tag filters
  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  const handleImageUpload = async (file: File, formBody: formDataT) => {
    setUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tags", JSON.stringify(formBody?.tags));
      formData.append("title", formBody?.title);
      formData.append("description", formBody?.description);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/stock-images/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchImages();
        toast.success("Images uploaded successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#FDF3E3",
            color: "#003b1f",
            padding: "12px 16px",
            fontSize: "14px",
          },
        });
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error?.message || "Failed to upload images", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#FDF3E3",
          color: "#003b1f",
          padding: "12px 16px",
          fontSize: "14px",
        },
      });
    } finally {
      setUploading(false);
      setError(null);
    }
  };

  const handleEditImage = async (file: File, formBody: formDataT) => {
    if (!selectedImage) {
      return;
    }
    try {
      setImages((pre: Image[]) =>
        pre.map((image) => {
          if (image?.imageName === selectedImage?.[0]?.imageName) {
            return { ...image, isSkeleton: true };
          }
          return image;
        })
      );
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tags", JSON.stringify(formBody?.tags));
      formData.append("title", formBody?.title);
      formData.append("description", formBody?.description);
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/stock-images/update/${selectedImage?.[0]?.imageName}`,
        {
          method: "put",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      if (response.ok) {
        await fetchImages();
        toast.success("updated successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#FDF3E3",
            color: "#003b1f",
            padding: "12px 16px",
            fontSize: "14px",
          },
        });
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update image", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#FDF3E3",
          color: "#003b1f",
          padding: "12px 16px",
          fontSize: "14px",
        },
      });
    } finally {
      setIsEditImage(false);
      setError(null);
      setSelectedImage(null);
    }
  };

  const handleImageDelete = async () => {
    if (!selectedImage) {
      return;
    }
    setIsDeleting(true);
    try {
      const token = await getToken();

      const body = { keys: selectedImage?.map((image) => image?.imageName) };
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/stock-images/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchImages();
        toast.success("Images deleted successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#FDF3E3",
            color: "#003b1f",
            padding: "12px 16px",
            fontSize: "14px",
          },
        });
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error?.message || "Failed to delete images", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#FDF3E3",
          color: "#003b1f",
          padding: "12px 16px",
          fontSize: "14px",
        },
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setSelectedImage(null);
      setError(null);
    }
  };

  const handleDeleteAllImages = () => {
    setIsDeleteModalOpen(true);
    setSelectedImage(images);
    setIsDeleteAllImages(true);
  };

  const downloadImage = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Preload images function
  const preloadImages = (imagesToPreload: Image[]) => {
    imagesToPreload.forEach((image) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => ({
          ...prev,
          [image.imageUrl]: true,
        }));
      };
      img.src = image.imageUrl;
    });
  };

  // Handle image load event
  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));
  };

  // Open image viewer
  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  // Close image viewer
  const closeImageViewer = () => {
    setViewerOpen(false);
  };

  // Navigate to next image
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < filteredImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0); // Loop back to first image
    }
  };

  // Navigate to previous image
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(filteredImages.length - 1); // Loop to last image
    }
  };

  return (
    <div className="w-full min-h-screen bg-brand-green-mid">
      <Sidebar />

      <div className="lg:pl-[88px] xl:pl-[248px] transition-all duration-300">
        <div className="p-6 pt-0">
          {/* Header Section */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4 pt-20 md:pt-14 xl:pl-8">
            <h5 className="font-Black text-brand-orange-cream text-brand-cream text-[26px] md:text-5xl leading-none">
              Sloane Stock Image Library
            </h5>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-8 py-3 xl:ml-8 bg-brand-cream text-brand-green rounded-lg font-Black hover:bg-brand-cream/90 transition-colors flex items-center gap-2"
                >
                  <FaUpload />
                  Upload Image
                </button>
                {images?.length > 0 && (
                  <button
                    onClick={() => {
                      handleDeleteAllImages();
                    }}
                    className="px-8 py-3 bg-brand-cream text-brand-green rounded-lg font-Black hover:bg-brand-cream/90 transition-colors flex items-center gap-2"
                  >
                    <MdDelete className="text-red-500 cursor-pointer" />
                    Delete All Images
                  </button>
                )}
              </>
            ) : null}

            {/* Tag Filter Button */}
            {availableTags.length > 0 && (
              <button
                onClick={() => setShowTagFilter(!showTagFilter)}
                className="px-8 py-3 bg-brand-cream text-brand-green rounded-lg font-Black hover:bg-brand-cream/90 transition-colors flex items-center gap-2"
              >
                <MdFilterList />
                Filter by Tags{" "}
                {selectedTags.length > 0 && `(${selectedTags.length})`}
              </button>
            )}
          </div>

          {/* Tag Filter Section */}
          {showTagFilter && (
            <div className="mt-4 p-4 bg-brand-dark-green rounded-lg xl:ml-8">
              <div className="flex justify-between items-center mb-3">
                <h6 className="text-brand-cream font-semibold">
                  Filter Images by Tags
                </h6>
                {selectedTags.length > 0 && (
                  <button
                    onClick={clearTagFilters}
                    className="text-brand-cream text-sm hover:text-brand-orange-cream transition-colors flex items-center gap-1"
                  >
                    <FaTimes /> Clear Filters
                  </button>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .slice(0, showAllTags ? availableTags.length : 50)
                  .map((tag) => (
                    <span
                      key={tag}
                      onClick={() =>
                        selectedTags.includes(tag)
                          ? removeTagFilter(tag)
                          : addTagFilter(tag)
                      }
                      className={`rounded-full px-3 py-1 text-sm mr-1 mb-1 flex items-center leading-none cursor-pointer transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-brand-cream text-brand-green-dark hover:bg-brand-cream/90"
                          : "bg-brand-cream/50 text-brand-green-dark hover:bg-brand-cream/70"
                      }`}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <FaTimesCircle
                          className="ml-1.5 text-brand-green-dark/70 hover:text-brand-green-dark"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTagFilter(tag);
                          }}
                        />
                      )}
                    </span>
                  ))}

                {availableTags.length > 50 && !showAllTags && (
                  <button
                    onClick={() => setShowAllTags(true)}
                    className="text-brand-cream hover:text-brand-orange-cream transition-colors flex items-center gap-1 text-sm"
                  >
                    <FaChevronDown /> Show more tags (
                    {availableTags.length - 50} more)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Filter Results Count */}
          {selectedTags.length > 0 && (
            <div className="mt-4 xl:ml-8 text-brand-cream">
              Showing {filteredImages.length} of {images.length} images
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center mt-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-cream"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              className="text-red-500 text-center mt-10 bg-brand-dark-green p-4 rounded-lg"
              key="error"
            >
              <p className="text-lg font-semibold">Error loading images</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredImages.length === 0 && (
            <div className="text-center mt-10 bg-brand-dark-green p-8 rounded-lg xl:ml-8">
              <p className="text-lg font-semibold text-brand-cream">
                No images found
              </p>
              {selectedTags.length > 0 ? (
                <p className="text-sm text-brand-cream mt-2">
                  No images match your selected filters. Try removing some
                  filters.
                </p>
              ) : (
                <p className="text-sm text-brand-cream mt-2">
                  {isAdmin
                    ? "Upload some images to get started."
                    : "No images are available in the library."}
                </p>
              )}
            </div>
          )}

          {/*
           * IMAGE GRID
           * ----------
           * - Simple grid layout with fixed height images
           * - No nested containers to cause spacing issues
           * - Images directly in grid cells with overlays positioned on top
           */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-10 xl:ml-8">
            {uploading && (
              <Box
                sx={{
                  height: "220px",
                  width: "100%",
                  bgcolor: "grey.300",
                  borderRadius: 2,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  animation="wave"
                />
              </Box>
            )}
            {filteredImages
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((image, index) => (
                <>
                  {image?.isSkeleton ? (
                    <Box
                      key={`skeleton-${index}`}
                      sx={{
                        height: "220px",
                        width: "100%",
                        bgcolor: "grey.300",
                        borderRadius: 2,
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        animation="wave"
                      />
                    </Box>
                  ) : (
                    <div
                      key={image._id}
                      className="relative group rounded-lg overflow-hidden shadow-lg transition-all duration-700 hover:scale-105 cursor-pointer"
                      style={{ height: "220px" }}
                      onClick={() => openImageViewer(index)}
                    >
                      {/*
                       * IMAGE DISPLAY
                       * --------------
                       * - Direct image with fixed height
                       * - No container causing spacing issues
                       * - Overlays positioned directly on the image
                       * - No timestamp query parameter to allow browser caching
                       */}
                      {!loadedImages[image.imageUrl] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-brand-dark-green">
                          <div className="w-8 h-8 border-2 border-brand-cream border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img
                        src={image.imageUrl}
                        alt={image.imageName}
                        className={`h-[220px] w-full object-cover object-center group-hover:scale-110 transition-transform duration-300 ${
                          loadedImages[image.imageUrl]
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        onLoad={() => handleImageLoad(image.imageUrl)}
                      />

                      {/* Download icon in the top-right corner */}
                      <div
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening the viewer
                          downloadImage(image.imageUrl);
                        }}
                      >
                        <MdDownload className="text-white text-2xl cursor-pointer drop-shadow-md hover:text-brand-cream transition-colors" />
                      </div>

                      {/* Bottom overlay */}
                      <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transform group-hover:opacity-100 opacity-0 transition-all duration-500 flex flex-col justify-end">
                        <div className="flex justify-between flex-col">
                          <div>
                            <p className="text-sm md:text-base font-semibold text-white truncate">
                              {image.title}
                            </p>
                            <p className="text-xs md:text-sm text-gray-200 line-clamp-2">
                              {image.description}
                            </p>
                            <div className="flex flex-wrap mt-2">
                              {image?.tags?.length > 0 &&
                                image?.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className={`rounded-full px-2 py-0.5 text-xs mr-2 mb-2 flex items-center leading-none cursor-pointer transition-all ${
                                      selectedTags.includes(tag)
                                        ? "bg-brand-cream text-brand-green-dark hover:bg-brand-cream/90"
                                        : "bg-brand-cream/50 text-brand-green-dark hover:bg-brand-cream/70"
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      selectedTags.includes(tag)
                                        ? removeTagFilter(tag)
                                        : addTagFilter(tag);
                                    }}
                                  >
                                    {tag}
                                    {selectedTags.includes(tag) && (
                                      <FaTimesCircle
                                        className="ml-1 text-xs text-brand-green-dark/70 hover:text-brand-green-dark"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeTagFilter(tag);
                                        }}
                                      />
                                    )}
                                  </span>
                                ))}
                            </div>
                          </div>

                          <div className="flex justify-between mt-2 items-end">
                            <p className="text-xs text-gray-300">
                              {(image.imageSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                            {isAdmin ? (
                              <div className="flex gap-2">
                                <MdEdit
                                  className="text-brand-cream cursor-pointer"
                                  onClick={() => {
                                    setSelectedImage([image]);
                                    setIsEditImage(true);
                                    setIsUploadModalOpen(true);
                                  }}
                                />
                                <MdDelete
                                  className="text-red-500 cursor-pointer"
                                  onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setSelectedImage([image]);
                                  }}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
          </div>
        </div>
      </div>
      <UploadImageModal
        isOpen={isUploadModalOpen}
        isEditImage={isEditImage}
        selectedImage={selectedImage?.length ? selectedImage?.[0] : null}
        onClose={() => {
          setIsUploadModalOpen(false);
          setIsEditImage(false);
          setSelectedImage(null);
        }}
        onUpload={(file: File, formData: formDataT) =>
          isEditImage
            ? handleEditImage(file, formData)
            : handleImageUpload(file, formData)
        }
      />
      <DeleteImageModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setIsDeleteAllImages(false);
          setSelectedImage(null);
        }}
        isDeleteAllImages={isDeleteAllImages}
        onDelete={handleImageDelete}
        isDeleting={isDeleting}
      />

      {/* Image Viewer Modal */}
      {filteredImages.length > 0 && (
        <Modal
          open={viewerOpen}
          onClose={closeImageViewer}
          aria-labelledby="image-viewer-modal"
          aria-describedby="view full size image"
          className="flex items-center justify-center"
        >
          <div
            className="relative bg-black/60 rounded-lg max-w-[90vw] max-h-[90vh] flex flex-col outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute -top-6 -right-6 text-brand-cream hover:text-brand-cream z-50"
              onClick={closeImageViewer}
            >
              <MdClose size={24} />
            </button>

            {/* Image container */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              {/* Loading spinner */}
              {!loadedImages[filteredImages[currentImageIndex]?.imageUrl] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-brand-cream border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* Main image */}
              <img
                src={filteredImages[currentImageIndex]?.imageUrl}
                alt={filteredImages[currentImageIndex]?.title}
                className={`max-h-[70vh] max-w-full object-contain transition-opacity duration-300 ${
                  loadedImages[filteredImages[currentImageIndex]?.imageUrl]
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                onLoad={() =>
                  handleImageLoad(filteredImages[currentImageIndex]?.imageUrl)
                }
              />

              {/* Navigation arrows */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    className="absolute left-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    onClick={prevImage}
                  >
                    <FaChevronLeft size={24} />
                  </button>
                  <button
                    className="absolute right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    onClick={nextImage}
                  >
                    <FaChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Image details - added padding */}
            <div className=" text-brand-cream px-6 pb-4">
              <h3 className="text-xl font-semibold">
                {filteredImages[currentImageIndex]?.title}
              </h3>
              <p className="text-sm mt-1">
                {filteredImages[currentImageIndex]?.description}
              </p>

              {/* Image metadata */}
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-300">
                  {(
                    filteredImages[currentImageIndex]?.imageSize /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </p>

                <div className="flex gap-3">
                  {/* Download button */}
                  <button
                    onClick={() =>
                      downloadImage(filteredImages[currentImageIndex]?.imageUrl)
                    }
                    className="text-brand-cream hover:text-brand-orange-cream transition-colors"
                  >
                    <MdDownload size={20} />
                  </button>

                  {/* Admin controls */}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedImage([filteredImages[currentImageIndex]]);
                          setIsEditImage(true);
                          setIsUploadModalOpen(true);
                          closeImageViewer();
                        }}
                        className="text-brand-cream hover:text-brand-orange-cream transition-colors"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setSelectedImage([filteredImages[currentImageIndex]]);
                          closeImageViewer();
                        }}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <MdDelete size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {filteredImages[currentImageIndex]?.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`rounded-full px-2 py-0.5 text-xs flex items-center leading-none cursor-pointer transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-brand-cream text-brand-green-dark hover:bg-brand-cream/90"
                        : "bg-brand-cream/50 text-brand-green-dark hover:bg-brand-cream/70"
                    }`}
                    onClick={() => {
                      selectedTags.includes(tag)
                        ? removeTagFilter(tag)
                        : addTagFilter(tag);
                      closeImageViewer();
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Image counter */}
              <div className="text-center mt-3 text-sm text-gray-300">
                {currentImageIndex + 1} of {filteredImages.length}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ImageLibrary;
