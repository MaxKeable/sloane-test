import React, { useState } from "react";
import { motion } from "framer-motion";
import VidModal from "./VidModal";
import ReactPlayer from "react-player";
import Icon from "../../components/core/icon";

interface VideoTileProps {
  title?: string;
  videoUrl: string;
  description?: string;
}

function getVimeoThumbnailUrl(url: string) {
  const vimeoRegex = /(?:vimeo.com\/|player.vimeo.com\/video\/)(\d+)/;
  const match = url.match(vimeoRegex);
  if (match && match[1]) {
    return `https://vumbnail.com/${match[1]}.jpg`;
  }
  return null;
}

const VideoTile: React.FC<VideoTileProps> = ({
  title,
  videoUrl,
  description,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const thumbnailUrl = getVimeoThumbnailUrl(videoUrl);

  // Check if description is long enough to need truncation
  const isDescriptionLong = description && description.length > 100;

  return (
    <div className="flex flex-col w-full h-full">
      <motion.div
        className="relative w-full aspect-video rounded-lg overflow-hidden border border-brand-cream hover:border-brand-logo cursor-pointer transition-all duration-300 hover:scale-105"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        onClick={() => setModalOpen(true)}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("[VideoTile] Error loading thumbnail");
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Video preview not available</span>
          </div>
        )}
      </motion.div>

      <div className="mt-0 px-1">
        <h3 className="text-brand-cream text-lg font-semibold mb-1">{title}</h3>
        {description && (
          <div>
            <p
              className={`text-brand-cream/80 text-sm ${!isDescriptionExpanded && isDescriptionLong ? "line-clamp-2" : ""}`}
            >
              {description}
            </p>
            {isDescriptionLong && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDescriptionExpanded(!isDescriptionExpanded);
                }}
                className="text-brand-cream/60 text-xs mt-1 flex items-center gap-1 hover:text-brand-cream transition-colors"
              >
                {isDescriptionExpanded ? (
                  <>
                    <span>Show less</span>
                    <Icon iconName="FaChevronUp" className="text-xs" />
                  </>
                ) : (
                  <>
                    <span>Show more</span>
                    <Icon iconName="FaChevronDown" className="text-xs" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <VidModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <div className="relative pt-[56.25%]">
            <ReactPlayer
              src={videoUrl}
              className="absolute top-0 left-0"
              width="100%"
              height="100%"
              controls
            />
          </div>
        </VidModal>
      )}
    </div>
  );
};

export default VideoTile;
