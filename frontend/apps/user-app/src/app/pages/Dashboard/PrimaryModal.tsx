import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import SecondaryModal from "./SecondaryModal";
import Button from "./Button";
import { useUser } from "@clerk/clerk-react";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";

import Modal from "./Modal"; // Import the Modal component
import LoadingSpinner from "./LoadingSpinner";

// Define the possible section names
type SectionType =
  | "Brand Language"
  | "Your Offering"
  | "Target Audience"
  | "Business Name"
  | "Words to Exclude"
  | "Delete From Model";

interface PrimaryModalProps {
  onClose: () => void;
}

const PrimaryModal: React.FC<PrimaryModalProps> = ({ onClose }) => {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(
    null
  ); // Make sure selectedSection is typed correctly
  const [sectionDescription, setSectionDescription] = useState<string | null>(
    null
  ); // For specific descriptions
  const [updatedSections, setUpdatedSections] = useState<{
    [key in SectionType]?: string;
  }>({});
  // const [loading, setLoading] = useState(false); // State to track loading
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showSaveConfirmationPopup, setShowSaveConfirmationPopup] =
    useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showDraftAlert, setShowDraftAlert] = useState(false);

  // Descriptions for each section
  const sectionDescriptions: { [key in SectionType]: string } = {
    "Brand Language":
      "As your business evolves so too will your brand language. We suggest creating a blog post, edit the langauge to your liking, copy the blog post and paste it here.",
    "Your Offering":
      "Update the details of the services & offerings your business offers. If you need to remove an offering or service, add that to the 'Delete From Model' section.",
    "Target Audience":
      "Define your target audience or avatar for more personalised marketing. If you need some help, head over to the 'Marketing Hub' and click the prompt for 'Target Audience'.",
    "Business Name": "If you have changed your business name, update it here.",
    "Words to Exclude":
      "Specify any words that you would like to avoid in your business model.",
    "Delete From Model":
      "Remove any specific things from your business model. Remember you can always ask sloane to give you a very detailed description of your business, brand language, services, audience etc - in any hub. Once you have the description, simply scroll through finding the things you want to remove. Simply return to this section and add them here.",
  };

  useEffect(() => {
    // Load section statuses from local storage when the component mounts
    const storedSections = localStorage.getItem("updatedSections");
    if (storedSections) {
      setUpdatedSections(JSON.parse(storedSections));
    }
  }, []);

  const handleSectionClick = (section: SectionType) => {
    setSelectedSection(section);
    setSectionDescription(sectionDescriptions[section]); // Set the corresponding description for the selected section
  };

  const handleSave = (section: SectionType, data: string) => {
    setUpdatedSections((prev) => {
      const updated = { ...prev, [section]: "Draft" };
      localStorage.setItem("updatedSections", JSON.stringify(updated)); // Save to local storage
      localStorage.setItem(`sectionData-${section}`, data); // Save the section data to local storage
      return updated;
    });
    setSelectedSection(null); // Close the secondary modal
  };

  const handleDone = (section: SectionType, data: string) => {
    setUpdatedSections((prev) => {
      const updated = { ...prev, [section]: "Done" };
      localStorage.setItem("updatedSections", JSON.stringify(updated)); // Save to local storage
      localStorage.setItem(`sectionData-${section}`, data); // Save the section data to local storage
      return updated;
    });
    setSelectedSection(null); // Close the secondary modal
  };

  const handlePrimaryDone = () => {
    const drafts = Object.values(updatedSections).includes("Draft");

    if (drafts) {
      setShowDraftAlert(true);
      return;
    }

    setShowConfirmationPopup(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmationPopup(false);
    setIsLoading(true);

    const emailData = {
      userName: user?.fullName ?? "N/A",
      userEmail: user?.primaryEmailAddress?.emailAddress ?? "N/A",
      businessName: user?.publicMetadata?.businessName ?? "N/A",
      brandLanguage:
        localStorage.getItem("sectionData-Brand Language") ?? "N/A",
      yourOffering: localStorage.getItem("sectionData-Your Offering") ?? "N/A",
      avatar: localStorage.getItem("sectionData-Target Audience") ?? "N/A",
      wordsToExclude:
        localStorage.getItem("sectionData-Words to Exclude") || "N/A",
      deleteFromModel:
        localStorage.getItem("sectionData-Delete From Model") || "N/A",
      newBusinessName:
        localStorage.getItem("sectionData-Business Name") || "N/A",
    };

    emailjs
      .send(
        "service_er87icd",
        "template_kvpnk8g",
        emailData,
        "kb71tHjt8IB1-AZ5J"
      )
      .then(() => {
        setIsLoading(false);
        setShowSuccessPopup(true);
      })
      .catch((error) => {
        console.error("Email sending failed", error);
        setIsLoading(false);
        alert("There was an error submitting your update. Please try again.");
      });
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    localStorage.clear();
    onClose();
    console.log("Local cleared");
  };

  const handleClose = () => {
    if (checkForUnsavedChanges()) {
      setShowCloseConfirmation(true);
    } else {
      localStorage.clear();
      onClose();
      console.log("Local cleared");
    }
  };

  const checkForUnsavedChanges = () => {
    const sections = [
      "Brand Language",
      "Your Offering",
      "Target Audience",
      "Business Name",
      "Words to Exclude",
      "Delete From Model",
    ];

    for (const section of sections) {
      if (localStorage.getItem(`sectionData-${section}`)) {
        return true;
      }
    }
    return false;
  };

  const confirmClose = () => {
    setShowCloseConfirmation(false);
    onClose();

    localStorage.clear(); // Clear all data in local storage
    onClose(); // Close the modal
  };

  const handlePrimarySave = () => {
    setShowSaveConfirmationPopup(true);
  };

  const confirmSave = () => {
    // Perform any save operations here if needed
    setShowSaveConfirmationPopup(false);
    onClose(); // Close the primary modal
  };

  const handleCancelClick = (section: SectionType) => {
    setUpdatedSections((prev) => {
      const updated = { ...prev };
      delete updated[section]; // Remove the section status to reset the button to its default state
      localStorage.removeItem(`sectionData-${section}`); // Clear specific section data from local storage
      localStorage.setItem("updatedSections", JSON.stringify(updated)); // Save the updated state to local storage
      return updated;
    });
    setSelectedSection(null); // Close the secondary modal view
  };

  return (
    <div className="fixed inset-0 flex items-center justify-start bg-gray-800 bg-opacity-50 pl-8 ">
      <motion.div
        className="bg-brand-white py-6 px-4 rounded-lg shadow-lg w-[650px] h-contain relative"
        initial={{ scale: 0.8 }} // Start small
        animate={{ scale: 1 }} // Grow to full size
        exit={{ scale: 0 }} // Shrink when exiting
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <h2 className="text-4xl font-Black mb-8 text-center text-brand-green">
          Update Your Business Details
        </h2>
        <div className="flex justify-center items-center w-full">
          <div className="grid grid-cols-2 gap-x-16 gap-y-8">
            {[
              "Brand Language",
              "Your Offering",
              "Target Audience",
              "Business Name",
              "Words to Exclude",
              "Delete From Model",
            ].map((section) => (
              <div key={section} className="relative flex items-center">
                <Button
                  title={section}
                  handleClick={() => handleSectionClick(section as SectionType)} // Type cast the string as SectionType
                />
                {updatedSections[section as SectionType] && (
                  <span
                    className={`absolute -right-2 -top-2 py-1 px-2 text-xs rounded-full text-white flex items-center ${
                      updatedSections[section as SectionType] === "Done"
                        ? "bg-brand-green"
                        : "bg-yellow-500"
                    }`}
                  >
                    {updatedSections[section as SectionType] === "Done" ? (
                      <>
                        <FaCheckCircle className="mr-1" /> Done
                      </>
                    ) : (
                      <>
                        <FaEdit className="mr-1" /> Draft
                      </>
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end w-full items-end space-x-2 pt-8 px-8 ">
          <button
            onClick={handleClose}
            className="py-2 px-4 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={handlePrimarySave} // Handle the save button to persist the state
            className="py-2 px-4 border-2 border-brand-orange-light text-brand-orange-light rounded-full hover:bg-brand-orange-light hover:text-white"
          >
            Save
          </button>
          <button
            onClick={handlePrimaryDone}
            className="py-2 px-4 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white"
          >
            Submit
          </button>
        </div>
      </motion.div>

      {selectedSection && (
        <SecondaryModal
          section={selectedSection}
          description={sectionDescription || ""}
          onSave={handleSave}
          onDone={handleDone}
          onCancel={handleCancelClick}
        />
      )}

      {showConfirmationPopup && (
        <Modal
          isOpen={showConfirmationPopup}
          onClose={() => setShowConfirmationPopup(false)}
        >
          <h2 className="text-2xl font-Black text-brand-green mb-4">
            Confirm Submission
          </h2>
          <p className="text-brand-green-dark">
            Confirming you are ready to submit all of your updates...
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowConfirmationPopup(false)}
              className="mr-2 py-2 px-4 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white"
            >
              Go Back
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="py-2 px-4 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}

      {showSaveConfirmationPopup && (
        <Modal
          isOpen={showSaveConfirmationPopup}
          onClose={() => setShowSaveConfirmationPopup(false)}
        >
          <h2 className="text-2xl font-Black text-brand-green mb-4">
            Save Confirmation
          </h2>
          <p className="text-brand-green-dark">
            All changes have been saved successfully.
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={confirmSave}
              className="py-2 px-4 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {showCloseConfirmation && (
        <Modal
          isOpen={showCloseConfirmation}
          onClose={() => setShowCloseConfirmation(false)}
        >
          <h2 className="text-2xl font-Black text-brand-green mb-4">
            Unsaved Changes
          </h2>
          <p className="text-brand-green-dark ">
            You have <span className="font-bold uppercase">unsaved</span>{" "}
            changes or changes that have not been{" "}
            <span className="font-bold uppercase">submitted</span>. If you close
            now, all work will be lost. <br></br>
            <br></br>Save or Submit your changes by clicking{" "}
            <span className="font-bold">'Go Back'</span> and saving/submitting.{" "}
            <br></br>
            <br></br>To continue with deleting all changes, click{" "}
            <span className="font-bold uppercase">'Close'</span>.
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowCloseConfirmation(false)}
              className="mr-2 py-2 px-4 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white"
            >
              Go Back
            </button>
            <button
              onClick={confirmClose}
              className="py-2 px-4 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {showDraftAlert && (
        <Modal isOpen={showDraftAlert} onClose={() => setShowDraftAlert(false)}>
          <h2 className="text-2xl font-Black text-brand-green mb-4">
            Incomplete Drafts
          </h2>
          <p className="text-brand-green-dark">
            You have drafts saved and not completed. Please complete all drafts
            by clicking 'Finished' in your drafted file. These will be the
            buttons that have a yellow 'Draft' badge on the top right.
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowDraftAlert(false)}
              className="py-2 px-4 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white"
            >
              OK
            </button>
          </div>
        </Modal>
      )}

      {isLoading && <LoadingSpinner />}

      {showSuccessPopup && (
        <Modal isOpen={showSuccessPopup} onClose={handleSuccessClose}>
          <h2 className="text-2xl font-Black text-brand-green mb-4">
            Success!
          </h2>
          <p className="text-brand-green-dark">
            Good job, you've successfully updated your business modal. <br></br>
            <br></br>This will be updated and ready for you in 72 hrs.<br></br>
            <br></br> To check if it's active, simply ask if the new changes
            have been updated.
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSuccessClose}
              className="py-2 px-4 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PrimaryModal;

/******************************************************************************************
                                     END PRIMARY MODAL COMPONENT
******************************************************************************************/
