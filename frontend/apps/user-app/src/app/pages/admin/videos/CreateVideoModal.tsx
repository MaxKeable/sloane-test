import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { VideoService } from "../../../../services/videoService";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { toast } from "react-hot-toast";

type Props = {
  onClose: () => void;
  token: string;
};

type FormInputs = {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailImage: FileList;
};

export default function CreateVideoModal({ onClose, token }: Props) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<FormInputs>();

  const { mutate: createVideo, isPending } = useMutation({
    mutationFn: async (data: FormInputs) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("videoUrl", data.videoUrl);
      if (data.thumbnailImage[0]) {
        formData.append("thumbnailImage", data.thumbnailImage[0]);
      }
      return VideoService.createVideo(formData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEOS.GET_ALL] });
      toast.success("Video created successfully");
      onClose();
    },
    onError: () => {
      toast.error("Failed to create video");
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-brand-green-dark">
          Create New Video
        </h2>
        <form
          onSubmit={handleSubmit((data) => createVideo(data))}
          className="space-y-4"
        >
          <div>
            <input
              {...register("title", { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Title"
            />
          </div>
          <div>
            <input
              {...register("videoUrl", { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Video URL"
            />
          </div>
          <div>
            <textarea
              {...register("description", { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
              rows={3}
            />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              {...register("thumbnailImage", { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-dark disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
