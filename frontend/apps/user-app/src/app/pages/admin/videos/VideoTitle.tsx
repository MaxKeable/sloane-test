import { Video } from "../../../../types/video";
import { useNavigate } from "react-router-dom";

type Props = {
  video: Video;
  isSelected: boolean;
};

export default function VideoTitle({ video, isSelected }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`?video=${video._id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left bg-white rounded-md p-4 hover:bg-gray-50 transition-colors text-brand-dark-green shadow-sm ${
        isSelected ? "border-4 border-brand-logo" : ""
      }`}
    >
      {video.title}
    </button>
  );
}
