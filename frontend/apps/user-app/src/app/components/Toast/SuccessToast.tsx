import { toast } from "react-hot-toast";
import { FaCopy, FaListAlt } from "react-icons/fa";

export const showSuccessToast = (
  message: string,
  isAutoClose: boolean = true,
  type: "copy" | "action" = "copy"
) => {
  const Icon = type === "copy" ? FaCopy : FaListAlt;

  toast.success(
    <div className="flex items-center gap-2">
      <Icon className="text-brand-green-dark text-sm" />
      <span className="text-brand-green-dark">{message}</span>
    </div>,
    {
      style: {
        background: "#fdf3e3", // brand cream
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      position: "top-center",
      duration: isAutoClose ? 2000 : Infinity,
    }
  );
};
