import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { service } from "../../services";
import { useAuth, useUser } from "@clerk/clerk-react";
import EastIcon from "@mui/icons-material/East";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const UpdateUserForm: React.FC = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const clerkUserId = searchParams.get("clerkUserId");
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  console.log("UpdateUserForm - ID from params:", id);

  useEffect(() => {
    const fetchUserData = async () => {
      if (clerkUserId) {
        const token = await getToken();
        console.log("Fetching user data for Clerk ID:", clerkUserId);
        const userResponse = await service.adminService.getOneUsers(
          token,
          clerkUserId
        );
        console.log("Fetched user data:", userResponse);
        setUserData(userResponse);
      }
    };
    fetchUserData();
  }, [clerkUserId, getToken]);

  const handleSubmit = async (values: any, actions: any) => {
    try {
      if (!id) {
        const error = "No user ID available for update";
        console.error(error);
        setErrorMessage(error);
        setErrorModalOpen(true);
        return;
      }

      // Only format website URL if provided and not empty
      if (
        values.businessProfile.businessUrl &&
        values.businessProfile.businessUrl.trim() !== ""
      ) {
        const url = values.businessProfile.businessUrl.toLowerCase().trim();
        // Remove any existing protocol
        const withoutProtocol = url.replace(/^(https?:\/\/)/, "");
        // Add https:// if there's actually a domain
        if (withoutProtocol) {
          values.businessProfile.businessUrl = `https://${withoutProtocol}`;
        }
      } else {
        values.businessProfile.businessUrl = "";
      }

      // Save Instagram handle as raw (no URL formatting)
      if (values.businessProfile.instagramUrl) {
        values.businessProfile.instagramUrl =
          values.businessProfile.instagramUrl.trim();
      } else {
        values.businessProfile.instagramUrl = "";
      }

      // Ensure motivation is always sent (even if empty)
      if (!values.businessProfile.motivation) {
        values.businessProfile.motivation = "";
      }

      const token = await getToken();
      console.log("Submitting update for user ID:", id);
      console.log("Update values:", values);
      await service.adminService.updateUser(token, values, id);
      navigate("/allUsers");
    } catch (error) {
      console.error("Failed to submit form", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      actions.setSubmitting(false);
      setErrorModalOpen(true);
    }
  };

  const handleDeleteUser = async () => {
    const token = await getToken();
    const response = await service.adminService.softDeleteUser(
      token,
      id ? id : ""
    );
    console.log(response);
    if (response.success) {
      navigate("/allUsers");
    } else {
      console.error("Failed to delete user");
    }
  };

  const inputClass =
    "block w-full py-2 px-3 border border-brand-cream/40 rounded-lg bg-transparent text-brand-cream placeholder-brand-cream/50 focus:border-brand-cream focus:ring-2 focus:ring-brand-cream/30 outline-none transition-all duration-200 text-base";
  const inputClass2 =
    "block w-full px-3 py-2 border border-brand-cream/40 rounded-lg bg-transparent text-brand-cream placeholder-brand-cream/50 scrollbar-hide focus:border-brand-cream focus:ring-2 focus:ring-brand-cream/30 outline-none min-h-[300px] text-base";
  const inputClass3 =
    "block w-full px-3 py-2 border border-brand-cream/40 rounded-lg bg-transparent text-brand-cream placeholder-brand-cream/50 scrollbar-hide focus:border-brand-cream focus:ring-2 focus:ring-brand-cream/30 outline-none min-h-[150px] text-base";

  return (
    <div className="min-h-screen w-full bg-brand-green flex flex-col items-center justify-center py-8 px-2">
      <h2 className="text-3xl lg:text-5xl font-black mb-10 text-brand-cream text-center tracking-tight drop-shadow-lg w-full">
        Update {userData?.name || user?.firstName || "User"}'s Business Profile
      </h2>
      {/* Back Button */}
      <button
        className="mb-6 px-6 py-2 rounded-full bg-transparent border border-brand-cream/40 text-brand-cream text-base font-semibold hover:bg-brand-cream/10 transition-all duration-200 self-center"
        onClick={() => navigate(-1)}
      >
        &larr; Back to All Users
      </button>
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch rounded-2xl border border-brand-logo/50 overflow-hidden shadow-none bg-transparent">
        {/* Left: Contact & Business Info */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 lg:py-8">
          <Formik
            initialValues={{
              name: userData?.name || user?.firstName || "",
              email:
                userData?.email ||
                user?.primaryEmailAddress?.emailAddress ||
                "",
              businessProfile: userData?.businessProfile || {
                businessName: "",
                businessType: "",
                businessSize: "",
                businessUrl: "",
                businessDescription: "",
                instagramUrl: "",
                referralSource: "",
                friendName: "",
                motivation: "",
              },
            }}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="flex flex-col lg:flex-row gap-10 w-full">
                {/* Left Column */}
                <div className="flex-1 space-y-8">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-sm font-bold text-brand-logo mb-2 tracking-widest uppercase">
                      Contact Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        id="name"
                        name="name"
                        placeholder="First name*"
                        className={inputClass}
                      />
                      <Field
                        id="email"
                        name="email"
                        placeholder="Work email*"
                        type="email"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  {/* Business Info */}
                  <div>
                    <h3 className="text-sm font-bold text-brand-logo mb-2 tracking-widest uppercase">
                      Business Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        id="businessProfile.businessName"
                        name="businessProfile.businessName"
                        placeholder="Business name*"
                        className={inputClass}
                      />
                      <Field
                        id="businessProfile.businessType"
                        name="businessProfile.businessType"
                        placeholder="Profession*"
                        className={inputClass}
                      />
                      <Field
                        id="businessProfile.businessSize"
                        name="businessProfile.businessSize"
                        placeholder="Business size*"
                        type="number"
                        className={inputClass}
                      />
                    </div>
                    <Field
                      as="textarea"
                      id="businessProfile.businessDescription"
                      name="businessProfile.businessDescription"
                      placeholder="Describe your business in 1-2 sentences*"
                      className={inputClass2 + " mt-2"}
                      multiline
                    />
                  </div>
                </div>
                {/* Right Column */}
                <div className="flex-1 space-y-8 flex flex-col justify-between">
                  {/* Social & Referral Info */}
                  <div>
                    <h3 className="text-sm font-bold text-brand-logo mb-2 tracking-widest uppercase">
                      Social & Referral Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        id="businessProfile.instagramUrl"
                        name="businessProfile.instagramUrl"
                        placeholder="Instagram handle (optional) - e.g. @yourbusiness"
                        className={inputClass}
                      />
                      <Field
                        as="select"
                        id="businessProfile.referralSource"
                        name="businessProfile.referralSource"
                        className={inputClass}
                      >
                        <option value="">
                          How did you find us? (optional)
                        </option>
                        <option value="Google">Google</option>
                        <option value="Podcast">Podcast</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Friend">Friend</option>
                      </Field>
                      {values.businessProfile.referralSource === "Friend" && (
                        <Field
                          id="businessProfile.friendName"
                          name="businessProfile.friendName"
                          placeholder="Friend's name (optional)"
                          className={inputClass}
                        />
                      )}
                      <Field
                        id="businessProfile.businessUrl"
                        name="businessProfile.businessUrl"
                        placeholder="Website URL (optional)"
                        className={inputClass}
                      />
                    </div>
                    <Field
                      as="textarea"
                      id="businessProfile.motivation"
                      name="businessProfile.motivation"
                      placeholder="What made you sign up? (optional)"
                      className={inputClass3 + " mt-2"}
                      multiline
                    />
                  </div>
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 mt-8 w-full">
                    <button
                      type="button"
                      className="px-6 py-2 rounded-full bg-brand-cream text-brand-green text-base font-semibold border border-brand-cream/30 hover:bg-brand-cream/90 hover:scale-105 transition-all duration-200 shadow-none w-full"
                      onClick={() =>
                        navigate(
                          `/admin/business-model/${id}?name=${userData?.name || user?.firstName || "User"}`
                        )
                      }
                    >
                      View Business Plan
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 rounded-full bg-brand-cream text-brand-green text-base font-semibold border border-brand-cream/30 hover:bg-brand-cream/90 hover:scale-105 transition-all duration-200 shadow-none w-full"
                      onClick={() => navigate(`/get-chats/${id}`)}
                    >
                      View Chat History
                    </button>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 flex items-center justify-center py-3 px-8 rounded-full bg-brand-cream text-brand-green text-base font-bold border border-brand-cream/30 hover:bg-brand-cream/90 hover:scale-105 transition-all duration-200 shadow-none ${isSubmitting ? "opacity-50" : ""}`}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                        <EastIcon className="ml-2 text-lg" />
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteUser}
                        className="flex-1 flex items-center justify-center py-3 px-8 rounded-full border-2 border-red-400 text-red-400 bg-transparent font-bold text-base hover:bg-red-600/10 hover:text-red-600 transition-all duration-200 shadow-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Modal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="bg-brand-cream p-4 rounded-lg shadow-lg max-w-sm mx-auto mt-32">
          <h2
            id="modal-title"
            className="text-xl font-Archivo mb-4 text-brand-green"
          >
            Form Submission Error
          </h2>
          <p id="modal-description">
            {errorMessage ? (
              <>
                <strong>Error: </strong> {errorMessage}
                <br />
                <br />
              </>
            ) : (
              <>
                Please check that you have the following:
                <ul className="list-disc ml-6 my-4 gap-y-20">
                  <li>
                    Email address in the right format (e.g. yourname@email.com)
                  </li>
                  <li className="my-4">
                    URL (e.g. www.yourbusiness.com) or type www.na.com if you
                    don't have a website
                  </li>
                  <li>All fields are filled in</li>
                </ul>
              </>
            )}
            Please email{" "}
            <span className="text-brand-green hover:underline">
              {" "}
              <a href="mailto:hello@sloane.biz">hello@sloane.biz</a>
            </span>{" "}
            if you continue to have issues.
          </p>
          <button
            onClick={() => setErrorModalOpen(false)}
            className="mt-4 bg-brand-green text-brand-cream py-2 px-4 rounded-full hover:bg-brand-green-dark hover:text-brand-logo transition duration-300"
          >
            Close
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateUserForm;
