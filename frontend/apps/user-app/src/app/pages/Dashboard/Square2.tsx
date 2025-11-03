import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "./Modal";
import NewlineText from "./NewlineText";
import { service } from "../../../services";
import { useAuth } from "@clerk/clerk-react";
import { EditAssistantModal } from "./CreateAssistantModal";

interface Square2Props {
  title: string;
  description?: string;
  link?: string;
  _id?: string;
  handleClick?: (_id: string) => void;
  className?: string;
}

const Square2: React.FC<Square2Props> = ({
  title,
  description,
  link,
  className,
  _id,
  handleClick,
}) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [assistantData, setAssistantData] = useState<any>(null);
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

  // Fetch assistant data when edit modal is opened
  useEffect(() => {
    const fetchAssistantData = async () => {
      if (isEditModalOpen && _id) {
        try {
          const token = await getToken();
          const data = await service.assistantService.getAssistant(token, _id);
          setAssistantData(data);
        } catch (error) {
          console.error("Failed to fetch assistant details", error);
        }
      }
    };

    fetchAssistantData();
  }, [isEditModalOpen, _id, getToken]);

  // Determine appropriate styles based on screen size
  const getResponsiveStyles = () => {
    // Base styles that apply to all screen sizes
    let styles = {
      fontSize: windowWidth < 768 ? "16px" : "20px",
      padding: windowWidth < 768 ? "6px" : "10px",
      iconSize: windowWidth < 768 ? "16px" : "20px",
      iconPosition: {
        top: windowWidth < 768 ? "7px" : "7px",
        left: windowWidth < 768 ? "3px" : "6px",
        right: windowWidth < 768 ? "7px" : "10px",
        bottom: windowWidth < 768 ? "3px" : "5px",
      },
    };

    return styles;
  };

  const responsiveStyles = getResponsiveStyles();

  const handleSquareClick = () => {
    if (link) {
      navigate(link);
    } else if (_id && handleClick) {
      handleClick(_id);
    } else if (_id) {
      navigate(`/assistant/${_id}`);
    }
  };

  const handleIconClick = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation(); // Stop the propagation to prevent the square's click event
    setModalOpen(true);
  };

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent this click from triggering parent's onClick
    setIsEditModalOpen(true);
  };

  return (
    <>
      <motion.div
        className={`relative bg-brand-cream w-full h-full text-center rounded-3xl shadow-lg text-brand-green flex flex-col justify-center items-center hover:bg-brand-logo hover:text-brand-green hover:shadow-2xl hover:transition-all  active:text-brand-logo active:underline hover:cursor-pointer transition-all duration-300 ${
          className || ""
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7 }}
        onClick={handleSquareClick}
        style={{ padding: responsiveStyles.padding }}
      >
        {/* Info Icon */}
        <div
          className="flex w-full absolute"
          style={{
            top: responsiveStyles.iconPosition.top,
            left: responsiveStyles.iconPosition.left,
          }}
        >
          <motion.div
            onClick={(e) => {
              e.stopPropagation(); // Prevent this click from triggering parent's onClick
              setModalOpen(true); // Opens the modal
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
              onClick={handleIconClick}
              sx={{
                color: "#FDF3E3",
                backgroundColor: "#075b33",
                borderRadius: "50%", // Make it round
                fontSize: responsiveStyles.iconSize, // Adjust size based on screen width
                cursor: "pointer", // Make it clickable
              }}
            />
          </motion.div>
        </div>

        {/* Custom Expert Badge */}
        <div
          className="absolute"
          style={{
            top: responsiveStyles.iconPosition.top,
            right: responsiveStyles.iconPosition.right,
          }}
        >
          <div className="border border-brand-green text-brand-green text-xs px-2 py-[1.5px] rounded-xl font-semibold shadow-sm">
            Custom Expert
          </div>
        </div>

        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg transform transition-transform duration-300 ease-in-out hover:cursor-pointer px-1 sm:px-2 mb-4 uppercase">
          {title}
        </h3>

        {/* Edit Icon - Moved to bottom right */}
        <div
          className="flex w-full absolute"
          style={{
            bottom: responsiveStyles.iconPosition.bottom,
            right: responsiveStyles.iconPosition.right,
          }}
        >
          <motion.div
            onClick={handleEditClick}
            whileHover={{ scale: 1.1 }}
            style={{ transformOrigin: "center bottom" }}
          >
            <div className="flex items-center gap-1 bg-brand-green-dark text-brand-cream px-2 py-1 rounded-xl font-semibold shadow-sm cursor-pointer">
              <EditIcon
                sx={{
                  fontSize: "0.875rem", // Smaller icon to match text
                }}
              />
              <span className="text-xs">Edit</span>
            </div>
          </motion.div>
        </div>

        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
            <h3 className="text-lg md:text-2xl text-brand-cream font-semibold mb-4">
              {title}
            </h3>
            <NewlineText text={description} className="text-brand-cream" />
          </Modal>
        )}
      </motion.div>

      {/* Edit Modal */}
      {isEditModalOpen && assistantData && (
        <EditAssistantModal
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          assistantData={assistantData}
        />
      )}
    </>
  );
};

export default Square2;
