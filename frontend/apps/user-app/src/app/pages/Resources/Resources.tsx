import VideoTile from "./VideoTile";
import { useQuery } from "@tanstack/react-query";
import { VideoService } from "../../../services/videoService";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import LoadingSpinner from "../Dashboard/LoadingSpinner";
import PageWrapper from "@/app/components/core/page-wrapper";

function Resources() {
  const {
    data: videos,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.VIDEOS.GET_ALL],
    queryFn: () => VideoService.getVideos(),
  });

  return (
    <PageWrapper title="How-To Video Library">
      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center text-brand-cream">Error loading videos</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {videos?.map((video) => (
            <div key={video._id} className="w-full max-w-[350px]">
              <VideoTile
                title={video.title}
                videoUrl={video.videoUrl}
                description={video.description}
              />
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

export default Resources;
