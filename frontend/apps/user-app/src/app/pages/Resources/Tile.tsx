import React, { useState } from "react";
import { motion } from "framer-motion";
import InfoIcon from '@mui/icons-material/Info';
import Modal from './Modal';


interface TileProps {
    title: string;
    description?: React.ReactNode;
    link: string;  // This should now contain the URL to the PDF for opening in a new window
    handleClick?: (_id: string) => void;  // If you still need handle click for other usages
}

const Tile: React.FC<TileProps> = ({ title, description, link, handleClick }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleIconClick = (event: React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation();  // Prevents the title click from triggering
        setModalOpen(true);
    };

    const handleTitleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();  // Prevents the modal from triggering
        window.open(link, '_blank');  // Opens the PDF in a new tab
    };

    return (
        <motion.div
        className="relative bg-brand-logo w-full h-3/4 text-center rounded-3xl shadow-lg text-brand-green flex flex-col justify-center items-center hover:bg-brand-cream hover:text-brand-green hover:shadow-2xl hover:scale-110 hover:transition-all hover:border-2  active:text-brand-logo  active:cursor-pointer p-2 px-8 md:px-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7 }}
    
        >
            <div className="flex w-full absolute top-2 left-3">
            <InfoIcon
          onClick={handleIconClick}
          sx={{
            color: '#FFEFD6', // Set the icon color
            backgroundColor: '#00BF63', // Set the background color
            borderRadius: '50%', // Make it round
            fontSize: '22px', // Adjust size if necessary
            cursor: 'pointer', // Make it clickable
          }}
        />
            </div>
            <div onClick={handleTitleClick} className="text-lg md:text-2xl hover:cursor-pointer font-Black">{title}</div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <h3 className="text-lg md:text-2xl text-brand-cream">{title}</h3>
                     <p className="text-brand-cream"> {description} {/* Render JSX elements directly */}</p>
                </Modal>
            )}
        </motion.div>
    );
};

export default Tile;
