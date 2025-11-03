import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import {
  FaUserPlus,
  FaRobot,
  FaEdit,
  FaUsers,
  FaLightbulb,
  FaCogs,
  FaClipboardList,
  FaVideo,
  FaChartBar,
  FaFlag,
} from "react-icons/fa";

const palette = [
  { name: "Ocean", bg: "#bdd8d4", text: "#003b1f" },
  { name: "Cacao", bg: "#9f9071", text: "#fff" },
  { name: "Tumeric", bg: "#f4d78e", text: "#7a5a00" },
  { name: "Chai", bg: "#dfc99e", text: "#5a4a2f" },
  { name: "Clay", bg: "#ddb794", text: "#5a3a1f" },
  { name: "Mint", bg: "#b8e1bf", text: "#003b1f" },
  { name: "Matcha", bg: "#e2edab", text: "#3a5a1f" },
  { name: "Coconut", bg: "#e6dccb", text: "#5a4a2f" },
];

const adminActions = [
  {
    title: "Create AI Assistant",
    description: "Build a new AI assistant for your users.",
    icon: FaRobot,
    to: "/assistantform",
    size: "col-span-2 row-span-1",
  },
  {
    title: "Create User",
    description: "Add a new user to the platform.",
    icon: FaUserPlus,
    to: "/userform",
    size: "col-span-1 row-span-1",
  },
  {
    title: "Update AI Assistant",
    description: "Edit or update existing AI assistants.",
    icon: FaEdit,
    to: "/updateAssistant",
    size: "col-span-1 row-span-1",
  },
  {
    title: "All Users",
    description: "View and manage all users.",
    icon: FaUsers,
    to: "/admin/allUsers",
    size: "col-span-1 row-span-2",
  },
  {
    title: "Create Prompt",
    description: "Add new prompts for assistants.",
    icon: FaLightbulb,
    to: "/create-prompt",
    size: "col-span-1 row-span-1",
  },
  {
    title: "Config",
    description: "Platform configuration and settings.",
    icon: FaCogs,
    to: "/config",
    size: "col-span-1 row-span-1",
  },
  {
    title: "Onboarding Creator",
    description: "Manage onboarding flows.",
    icon: FaClipboardList,
    to: "/admin/onboarding",
    size: "col-span-1 row-span-1",
  },
  {
    title: "Video How To's",
    description: "Upload and manage tutorial videos.",
    icon: FaVideo,
    to: "/admin/videos",
    size: "col-span-1 row-span-1",
  },
  {
    title: "Data Insights",
    description: "View analytics and insights.",
    icon: FaChartBar,
    to: "/admin/data-insights",
    size: "col-span-2 row-span-1",
  },
  {
    title: "Move Club",
    description: "View Move Club registrations and manage attendees.",
    icon: FaUsers,
    to: "/admin/move-club",
    size: "col-span-2 row-span-1",
  },
  {
    title: "Feature Flags",
    description: "View and manage feature flags.",
    icon: FaFlag,
    to: "/admin/feature-flags",
    size: "col-span-1 row-span-1",
  },
];

function Admin() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (user?.publicMetadata.account !== "admin") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-brand-green">
      <div className="w-full max-w-6xl ">
        <h1 className="text-2xl md:text-3xl font-extrabold text-brand-cream">
          Founders Lounge
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-brand-cream/80 mb-4">
          Your Admin Control Center
        </p>
      </div>
      <div className="w-full max-w-6xl grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6 auto-rows-[minmax(120px,1fr)]">
        {adminActions.map((action, idx) => {
          const color = palette[idx % palette.length];
          return (
            <button
              key={action.title}
              onClick={() => navigate(action.to)}
              className={`relative flex flex-col justify-between p-4 sm:p-6 rounded-2xl shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group ${action.size}`}
              style={{
                minHeight: 120,
                background: color.bg,
                color: color.text,
              }}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-2">
                <action.icon className="text-2xl sm:text-3xl md:text-4xl drop-shadow-lg" />
                <span className="text-lg sm:text-xl md:text-2xl font-bold break-words max-w-[70vw] sm:max-w-none">
                  {action.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm md:text-base opacity-80 group-hover:opacity-100 transition-opacity break-words max-w-[90vw] sm:max-w-none">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Admin;
