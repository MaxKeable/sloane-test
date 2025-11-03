import React from "react";
import { motion } from "framer-motion";
import SidebarItem from "./item";
import type { SidebarList } from "./side-bar";
import { Link } from "react-router-dom";
import logo from "../Images/logo.png";
import logoSmall from "../../../../public/images/logo512.png";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui-kit/components/ui/card";
import { Button } from "@repo/ui-kit/components/ui/button";
import { FaExclamationTriangle } from "react-icons/fa";
import { GoalsSidebar } from "./goals";

type Props = {
  items: SidebarList[];
  isCollapsed: boolean;
};

const sidebarVariants = {
  expanded: { width: "280px" },
  collapsed: { width: "80px" },
};

const SidebarDesktop: React.FC<Props> = ({ items, isCollapsed }) => {
  return (
    <motion.div
      className="hidden lg:flex flex-col h-full bg-brand-green-dark overflow-hidden"
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col space-y-3 p-3 flex-grow overflow-y-auto">
        <div className="w-32">
          <Link to="/dashboard">
            <img
              src={isCollapsed ? logoSmall : logo}
              alt="Logo"
              className={`${isCollapsed ? "h-8 object-contain ml-3" : "w-full"}`}
            />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
              <h3 className="text-sm text-accent">{item.section.heading}</h3>
              <div className="flex flex-col gap-1">
                {item.section.items.map((item, index) => (
                  <SidebarItem
                    key={index}
                    item={item}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {!isCollapsed && (
        <div className="p-2">
          <GoalsSidebar />
          {/* <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FaExclamationTriangle className="text-destructive size-4" />
                <CardTitle>Finish onboarding</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                You haven't finished onboarding yet. Please finish onboarding to
                get full access to the power of Sloane. (placeholder for now)
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button size={"sm"} variant={"secondary"}>
                Finish onboarding
              </Button>
            </CardFooter>
          </Card> */}
        </div>
      )}
    </motion.div>
  );
};

export default SidebarDesktop;
