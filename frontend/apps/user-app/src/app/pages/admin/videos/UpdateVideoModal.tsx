import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VideoService } from "../../../../services/videoService";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { toast } from "react-hot-toast";
import { Video } from "../../../../types/video";

type Props = {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
  token: string;
};

export default function UpdateVideoModal({
  video,
  isOpen,
  onClose,
  token,
}: Props) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description || "");
  const [videoUrl, setVideoUrl] = useState(video.videoUrl);
  const queryClient = useQueryClient();

  const { mutate: updateVideo, isPending } = useMutation({
    mutationFn: (data: Partial<Video>) =>
      VideoService.updateVideo(video._id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEOS.GET_ALL] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.VIDEOS.GET_ONE, video._id],
      });
      toast.success("Video updated successfully");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update video");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVideo({ title, description, videoUrl });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-brand-green-dark mb-4">
          Update Video
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-green-dark rounded-md disabled:opacity-50"
            >
              {isPending ? "Updating..." : "Update Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
