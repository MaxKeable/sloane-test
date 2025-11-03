import React, { useState, useEffect } from "react";
import {
  FaVideo,
  FaTasks,
  FaPrayingHands,
  FaClock,
  FaHome,
  FaBriefcase,
  FaClipboardList,
} from "react-icons/fa";
import { useTimer } from "../../../context/TimerContext";
import { useMindfulness } from "../../../context/MindfulnessContext";
import SidebarItem from "./item";
import { AiIcon } from "../Icons/ai-icon";
import SidebarDesktop from "./side-bar-desktop";
import SidebarMobile from "./side-bar-modbil";

export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface SidebarList {
  section: {
    heading?: string;
    items: SidebarItem[];
  };
}

const BREAKPOINT_LG = 900;

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { openMindfulness } = useMindfulness();
  const { openPomodoroModal } = useTimer();

  const sidebarItems: SidebarList[] = [
    {
      section: {
        items: [
          { icon: FaHome, label: "Dashboard", href: "/dashboard" },
          { icon: AiIcon, label: "Ai Chats", href: "/dashboard/ai-chats" },
          { icon: FaTasks, label: "Action Plan", href: "/dashboard/actions" },
        ],
      },
    },
    {
      section: {
        heading: "Wellness",
        items: [
          {
            icon: FaPrayingHands,
            label: "Daily Mindfulness",
            onClick: openMindfulness,
          },
          { icon: FaClock, label: "Mindful Timer", onClick: openPomodoroModal },
        ],
      },
    },
    {
      section: {
        heading: "Settings",
        items: [
          {
            icon: FaClipboardList,
            label: "Business Interview",
            href: "/business-interview",
          },
          {
            icon: FaBriefcase,
            label: "Business Background",
            href: "/dashboard/business-model",
          },
          {
            icon: FaVideo,
            label: "How-To Videos",
            href: "/dashboard/resources",
          },
        ],
      },
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= BREAKPOINT_LG);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleItemClick = (item: SidebarItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      <div className="w-fit">
        <SidebarDesktop items={sidebarItems} isCollapsed={isCollapsed} />
      </div>
      <SidebarMobile
        items={sidebarItems}
        isOpen={isMobileOpen}
        onToggle={() => setIsMobileOpen(!isMobileOpen)}
        onItemClick={handleItemClick}
      />
    </>
  );
};

export default Sidebar;
