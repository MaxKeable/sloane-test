import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SidebarItem as SidebarItemType, SidebarList } from "./side-bar";
import { NavLink } from "react-router-dom";

type Props = {
  items: SidebarList[];
  isOpen: boolean;
  onToggle: () => void;
  onItemClick: (item: SidebarItemType) => void;
};

const hamburgerLineVariants = {
  top: {
    initial: { width: 20, scale: 1 },
    tap: { scale: 0.9 },
    open: { rotate: 45, y: 8, width: 24 },
  },
  middle: {
    initial: { width: 24, scale: 1 },
    tap: { scale: 0.9 },
    open: { opacity: 0 },
  },
  bottom: {
    initial: { width: 20, scale: 1 },
    tap: { scale: 0.9 },
    open: { rotate: -45, y: -8, width: 24 },
  },
};

const SidebarMobile: React.FC<Props> = ({
  items,
  isOpen,
  onToggle,
  onItemClick,
}) => {
  const isActiveRoute = (href?: string) => {
    return href ? location.pathname === href : false;
  };
  const MobileMenuButton = () => (
    <motion.button
      className="lg:hidden fixed top-2 left-2 z-50 p-2 rounded-full bg-brand-green-dark hover:bg-brand-green-dark/90 transition-colors duration-300 shadow-lg flex flex-col items-center justify-center cursor-pointer gap-[6px] w-10 h-10"
      onClick={onToggle}
      initial="initial"
      whileTap="tap"
      animate={isOpen ? "open" : "initial"}
    >
      <motion.span
        className="h-[2px] bg-brand-logo"
        variants={hamburgerLineVariants.top}
      />
      <motion.span
        className="h-[2px] bg-brand-logo"
        variants={hamburgerLineVariants.middle}
      />
      <motion.span
        className="h-[2px] bg-brand-logo"
        variants={hamburgerLineVariants.bottom}
      />
    </motion.button>
  );

  return (
    <>
      <MobileMenuButton />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="lg:hidden fixed inset-0 bg-brand-green-dark z-40 backdrop-blur-sm"
          >
            <div className="flex flex-col p-6 pt-16 space-y-4">
              {items.map((section, sectionIndex) => (
                <div key={sectionIndex} className="flex flex-col gap-1">
                  <h3 className=" text-white">{section.section.heading}</h3>
                  <div className="flex flex-col gap-2">
                    {section.section.items.map((navItem, index) => (
                      <motion.div
                        key={`${sectionIndex}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {navItem.href ? (
                          <NavLink
                            to={navItem.href}
                            onClick={() => onItemClick(navItem)}
                            className={`flex items-center p-4 rounded-lg ${
                              isActiveRoute(navItem.href)
                                ? "bg-brand-cream text-brand-green"
                                : "bg-brand-green text-brand-cream hover:bg-brand-logo hover:text-brand-green-dark"
                            } transition-all duration-300 shadow-md`}
                          >
                            <navItem.icon className="text-2xl mr-4" />
                            <span className="text-lg">{navItem.label}</span>
                          </NavLink>
                        ) : (
                          <button
                            onClick={() => onItemClick(navItem)}
                            className="w-full flex items-center p-4 rounded-lg bg-brand-green text-brand-cream hover:bg-brand-logo hover:text-brand-green-dark transition-all duration-300 shadow-md"
                          >
                            <navItem.icon className="text-2xl mr-4" />
                            <span className="text-lg">{navItem.label}</span>
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarMobile;
