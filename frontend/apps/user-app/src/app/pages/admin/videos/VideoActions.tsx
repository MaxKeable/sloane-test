import { useState } from "react";
import { FaSpinner, FaTrash, FaEdit } from "react-icons/fa";
import { VideoService } from "../../../../services/videoService";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import UpdateVideoModal from "./UpdateVideoModal";
import { Video } from "../../../../types/video";

type Props = {
  videoId: string;
  token: string;
};

export default function VideoActions({ videoId, token }: Props) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: video } = useQuery<Video>({
    queryKey: [QUERY_KEYS.VIDEOS.GET_ONE, videoId],
    queryFn: () => VideoService.getVideo(videoId, token),
  });

  const { mutate: deleteVideo, isPending: isDeleting } = useMutation({
    mutationFn: () => VideoService.deleteVideo(videoId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEOS.GET_ALL] });
      toast.success("Video deleted successfully");
      navigate("/admin/videos");
    },
    onError: () => {
      toast.error("Failed to delete video");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      deleteVideo();
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setIsUpdateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-dark transition-colors"
          disabled={!video}
        >
          <FaEdit />
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {isUpdateModalOpen && video && (
        <UpdateVideoModal
          video={video}
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          token={token}
        />
      )}
    </>
  );
}
