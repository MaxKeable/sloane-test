import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { VideoService } from "../../../../services/videoService";
import { Video } from "../../../../types/video";
import VideoActions from "./VideoActions";
import { useState } from "react";

type Props = {
  videoId: string;
  token: string;
};

function getVimeoEmbedUrl(url: string) {
  // Handle different Vimeo URL formats
  const vimeoRegex = /(?:vimeo.com\/|player.vimeo.com\/video\/)(\d+)/;
  const match = url.match(vimeoRegex);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }
  return url;
}

function getVimeoThumbnailUrl(url: string) {
  // Extract video ID from Vimeo URL
  const vimeoRegex = /(?:vimeo.com\/|player.vimeo.com\/video\/)(\d+)/;
  const match = url.match(vimeoRegex);
  if (match && match[1]) {
    // Return the Vimeo thumbnail URL
    return `https://vumbnail.com/${match[1]}.jpg`;
  }
  return null;
}

export default function VideoOverview({ videoId, token }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const {
    data: video,
    isLoading,
    error,
  } = useQuery<Video, Error>({
    queryKey: [QUERY_KEYS.VIDEOS.GET_ONE, videoId],
    queryFn: async () => {
      console.log("[VideoOverview] Fetching video:", videoId);
      const result = await VideoService.getVideo(videoId, token);
      console.log("[VideoOverview] Raw video data:", result);
      return result;
    },
    enabled: !!token,
  });

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) {
    console.error("[VideoOverview] Error:", error);
    return <div className="text-white">Error loading video</div>;
  }
  if (!video) return null;

  const embedUrl = getVimeoEmbedUrl(video.videoUrl);
  const thumbnailUrl = getVimeoThumbnailUrl(video.videoUrl);

  return (
    <div className="grid grid-cols-6 gap-4 p-4">
      <div className="col-span-4 bg-white rounded-lg overflow-hidden shadow-lg">
        {!isPlaying ? (
          <div
            className="relative w-full h-[350px] cursor-pointer group"
            onClick={() => setIsPlaying(true)}
          >
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(
                    "[VideoOverview] Error loading Vimeo thumbnail"
                  );
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">
                  Video preview not available
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 group-hover:bg-white/30 transition-all">
                <div className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[20px] border-l-white border-transparent ml-2" />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            width="100%"
            height="350"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={`${video.title || "Video"} player`}
          />
        )}
      </div>
      <div className="col-span-2 space-y-4">
        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="text-white text-xl font-semibold mb-2">
            {video.title || "Untitled Video"}
          </h3>
          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
            {video.description || "No description available"}
          </p>
        </div>
        <VideoActions videoId={videoId} token={token} />
      </div>
    </div>
  );
}
