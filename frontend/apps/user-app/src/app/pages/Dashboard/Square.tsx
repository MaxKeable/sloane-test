import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Ensure this import path is correct
import InfoIcon from "@mui/icons-material/Info";
import NewlineText from "./NewlineText";

interface SquareProps {
  title: string;
  description?: string;
  _id?: string;
  handleClick?: (_id: string) => void;
}

const Square: React.FC<SquareProps> = ({
  title,
  description,
  _id,
  handleClick,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine appropriate styles based on screen size
  const getResponsiveStyles = () => {
    // Base styles that apply to all screen sizes
    let styles = {
      fontSize: windowWidth < 768 ? "16px" : "20px",
      padding: windowWidth < 768 ? "6px" : "10px",
      iconSize: windowWidth < 768 ? "16px" : "20px",
      iconPosition: {
        top: windowWidth < 768 ? "3px" : "5px",
        left: windowWidth < 768 ? "8px" : "6px",
      },
    };

    return styles;
  };

  const responsiveStyles = getResponsiveStyles();

  const squareClass = `
        relative
        bg-brand-cream
        w-full
        h-full
        text-center
        rounded-3xl
        shadow-lg
        text-brand-green
        flex
        flex-col
        justify-center
        items-center
        hover:bg-brand-logo
        hover:text-brand-green
        hover:shadow-2xl
        hover:scale-105
        active:text-brand-green-logo
        transition-all
        duration-300
        active:cursor-pointer
        p-2
        hover:cursor-pointer
        overflow-hidden
    `;

  return (
    <div
      className={`${squareClass} dash-step-1`}
      onClick={() => {
        if (_id && !handleClick) {
          navigate(`/assistant/${_id.toString()}`);
        } else if (handleClick && _id) {
          handleClick(_id);
        }
      }}
      style={{ padding: responsiveStyles.padding }}
    >
      <div
        className="flex w-full absolute"
        style={{
          top: responsiveStyles.iconPosition.top,
          left: responsiveStyles.iconPosition.left,
        }}
      >
        <motion.div
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            repeat: 2,
            duration: 2,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "center top" }}
        >
          <InfoIcon
            sx={{
              color: "#FDF3E3",
              backgroundColor: "#075b33",
              borderRadius: "50%",
              fontSize: responsiveStyles.iconSize,
              cursor: "pointer",
            }}
          />
        </motion.div>
      </div>
      <h3 className="text-sm md:text-base lg:text-lg px-2 sm:px-4 w-full text-center font-semibold line-clamp-2 break-words uppercase">
        {title}
      </h3>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <h3 className="text-md md:text-2xl text-brand-cream font-semibold mb-4">
            {title}
          </h3>
          <NewlineText text={description} className="text-brand-cream" />
        </Modal>
      )}
    </div>
  );
};

export default Square;
