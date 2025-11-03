import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  title: string;
  description?: string;
  hideBackButton?: boolean;
};

export const AdminHeader = ({ title, description, hideBackButton }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-4 pb-8">
      {!hideBackButton && (
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-brand-cream/10 hover:bg-brand-cream/20 transition-colors"
        >
          <FaArrowLeft className="text-brand-cream" />
        </button>
      )}
      <div>
        <p className="text-2xl md:text-3xl font-extrabold text-brand-cream">
          {title}
        </p>
        <p className="text-lg md:text-xl text-brand-cream/80">{description}</p>
      </div>
    </div>
  );
};
