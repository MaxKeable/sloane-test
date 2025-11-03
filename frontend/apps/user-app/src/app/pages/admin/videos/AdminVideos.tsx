import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VideoService } from "../../../../services/videoService";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import VideoTitle from "./VideoTitle";
import VideoOverview from "./VideoOverview";
import ClientMessage from "../../../components/core/ClientMessage";
import CreateVideoModal from "./CreateVideoModal";
import { Video } from "../../../../types/video";
import { useSearchParams } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";

export default function AdminVideos() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("video");
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string>();

  // Get token when component mounts or auth changes
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const newToken = await getToken();
        setToken(newToken || undefined);
      } catch (error) {
        console.error("[AdminVideos] Error fetching token:", error);
      }
    };
    fetchToken();
  }, [getToken]);

  const {
    data: videos,
    isLoading,
    error,
  } = useQuery<Video[], Error>({
    queryKey: [QUERY_KEYS.VIDEOS.GET_ALL],
    queryFn: async () => {
      try {
        console.log("[AdminVideos] Fetching videos with token:", !!token);
        const result = await VideoService.getVideos(token);
        console.log("[AdminVideos] Videos fetched:", result);
        if (!result) {
          throw new Error("No videos returned from the server");
        }
        return result;
      } catch (error) {
        console.error("[AdminVideos] Error in queryFn:", error);
        throw error;
      }
    },
    enabled: !!token, // Only run query when we have a token
    retry: 1, // Only retry once
  });

  useEffect(() => {
    if (error) {
      console.error("[AdminVideos] Error fetching videos:", error);
    }
  }, [error]);

  if (user?.publicMetadata.account !== "admin") {
    return (
      <ClientMessage message="You are not authorized to access this page" />
    );
  }

  if (!token) return <ClientMessage message="Authenticating..." />;
  if (isLoading) return <ClientMessage message="Loading..." />;
  if (error) return <ClientMessage message="Error loading videos" />;
  if (!videos) return <ClientMessage message="No videos found" />;

  return (
    <div className="flex flex-col items-center pt-24 min-h-screen bg-brand-green">
      <h2 className="text-white text-6xl">Video How To's</h2>
      <p className="text-white text-lg">
        Manage your video tutorials and guides here
      </p>
      <div className="grid grid-cols-6 gap-4 py-4 px-8 w-full pt-16">
        <div className="col-span-2 flex items-center flex-col gap-2 max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white">
          {videos.map((video: Video) => (
            <VideoTitle
              key={video._id}
              video={video}
              isSelected={video._id === videoId}
            />
          ))}
          <button
            onClick={() => setIsOpen(true)}
            className="w-full px-6 py-2 rounded-lg border border-white text-white hover:bg-white/10 transition-colors font-semibold capitalize"
          >
            + add video
          </button>
        </div>
        <div className="col-span-4 flex flex-col gap-2">
          {videoId && <VideoOverview videoId={videoId} token={token} />}
        </div>
      </div>
      {isOpen && (
        <CreateVideoModal onClose={() => setIsOpen(false)} token={token} />
      )}
    </div>
  );
}
