import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";

/******************************************************************************************
                                    TYPES
******************************************************************************************/
type SectionType =
  | "Brand Language"
  | "Your Offering"
  | "Target Audience"
  | "Business Name"
  | "Words to Exclude"
  | "Delete From Model";

/******************************************************************************************
                                    PROPS
******************************************************************************************/
interface SecondaryModalProps {
  section: SectionType; // Use SectionType here
  description: string;
  onSave: (section: SectionType, data: string) => void; // Update the type for section
  onDone: (section: SectionType, data: string) => void; // Update the type for section
  onCancel: (section: SectionType) => void; // Update the type for section
}

/******************************************************************************************
                                    COMPONENT START
******************************************************************************************/
const SecondaryModal: React.FC<SecondaryModalProps> = ({
  section,
  description,
  onSave,
  onDone,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(`sectionData-${section}`);
    if (savedData) {
      setInputValue(savedData);
    }
  }, [section]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleDoneClick = () => {
    onDone(section, inputValue); // Pass both section and data to the onDone function
  };

  const handleClearClick = () => {
    setShowClearConfirmation(true);
  };

  const confirmClear = () => {
    localStorage.removeItem(`sectionData-${section}`);
    setInputValue("");
    onCancel(section);
    setShowClearConfirmation(false);
  };

  /******************************************************************************************
                                     RENDER COMPONENT
  ******************************************************************************************/

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      {/* Apply motion to the modal container only */}
      <motion.div
        className="bg-brand-white p-6 rounded-lg shadow-lg w-[800px] ml-[550px] h-contain"
        initial={{ x: "50vw" }} // Start off the screen to the left
        animate={{ x: 0 }} // Slide into the screen from the left
        exit={{ x: "-100vw" }} // Slide out to the left on exit
        transition={{ type: "spring", duration: 0.4 }} // Smooth sliding effect
      >
        <h2 className="text-2xl font-Black mb-4 text-brand-green leading-none">
          {section}
        </h2>
        <p className="mb-4 text-md text-brand-green-dark">{description}</p>
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          className="w-full h-[400px] p-2 border border-gray-300 rounded-lg bg-brand-white text-brand-green-dark focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-transparent"
          placeholder={`Enter your updates for here...`}
        />
        
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleClearClick}
            className="py-2 px-4 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white"
          >
            Clear
          </button>
          <button
            onClick={() => onSave(section, inputValue)}
            className="py-2 px-4 border-2 border-brand-orange-light text-brand-orange-light rounded-full hover:bg-brand-orange-light hover:text-white"
          >
            Save Draft
          </button>
          <button
            onClick={handleDoneClick}
            className="py-2 px-4 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white"
          >
            Finished
          </button>
        </div>
      </motion.div>

      {showClearConfirmation && (
        <Modal
          isOpen={showClearConfirmation}
          onClose={() => setShowClearConfirmation(false)}
        >
          <h2 className="text-2xl font-Black text-brand-green mb-4">Confirm Clear</h2>
          <p className="text-brand-green-dark">Are you sure you want to discard the changes?</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowClearConfirmation(false)}
              className="mr-2 py-2 px-4 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white"
            >
              Go Back
            </button>
            <button
              onClick={confirmClear}
              className="py-2 px-4 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white"
            >
              I'm Sure
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SecondaryModal;

/******************************************************************************************
                                     END SECONDARY MODAL COMPONENT
******************************************************************************************/
