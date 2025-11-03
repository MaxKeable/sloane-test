import { motion } from "framer-motion";
import { type SidebarItem } from "./side-bar";
import { NavLink } from "react-router-dom";

type Props = {
  item: SidebarItem;
  isCollapsed: boolean;
};

export default function SidebarItem({ item, isCollapsed }: Props) {
  const isActiveRoute = (href?: string) => {
    return href ? location.pathname === href : false;
  };

  const isCollapsedClasses = isCollapsed ? "justify-center" : "justify-start";
  const isActiveClasses = isActiveRoute(item.href ?? "")
    ? "bg-white/20 text-white"
    : "text-white";
  const buttonClasses = `flex items-center text-sm p-2 rounded-sm transition-all duration-300 shadow-md hover:shadow-lg w-full hover:bg-white/5 ${isCollapsedClasses} ${isActiveClasses}`;

  return (
    <motion.div className="relative group" whileTap={{ scale: 0.98 }}>
      {item.href ? (
        <NavLink to={item.href} className={buttonClasses}>
          <item.icon className={`text-lg ${!isCollapsed && "mr-3"}`} />
          {!isCollapsed && <span>{item.label}</span>}
        </NavLink>
      ) : (
        <button onClick={() => item.onClick?.()} className={buttonClasses}>
          <item.icon className={`text-lg ${!isCollapsed && "mr-3"}`} />
          {!isCollapsed && <span>{item.label}</span>}
        </button>
      )}

      {isCollapsed && (
        <div className="absolute left-full ml-2 pl-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="hidden group-hover:block bg-brand-green-dark text-brand-cream px-3 py-2 rounded-lg shadow-lg whitespace-nowrap"
          >
            {item.label}
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 transform rotate-45 w-2 h-2 bg-brand-green-dark"></div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
