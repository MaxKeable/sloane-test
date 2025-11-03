// src/components/Pages/PromptForm.tsx

import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import NotAdmin from "./NotAdmin";
import { useUser } from "@clerk/clerk-react";
import { service } from "../../services";

interface Assistant {
  _id: string;
  name: string;
}

const PromptForm: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [assistants, setAssistants] = useState<Assistant[]>([]);

  useEffect(() => {
    const fetchAssistants = async () => {
      const token = await getToken();
      const data = await service.assistantService.getAssistants(token);
      setAssistants(data);
    };
    fetchAssistants();
  }, [getToken]);

  const inputClass =
    "my-4 block w-full py-2 px-4 border border-brand-logo rounded-full bg-transparent text-brand-green-dark placeholder-green-700 focus:border-brand-green-dark outline-none";
  const labelClass = "block text-brand-logo font-bold mb-2";

  const handleBackClick = () => {
    navigate(-1); // Takes the user back to the previous page
  };

  if (user?.publicMetadata.account !== "admin") {
    return <NotAdmin />;
  }

  return (
    <div className="bg-brand-green">
      <div className="flex flex-col justify-center items-center w-screen-1 py-8 min-h-screen max-w-[1440px] mx-auto">
        <h2 className="text-xl lg:text-4xl font-bold mb-4 text-brand-cream">
          Create Prompt
        </h2>
        <p
          className="text-brand-green-dark font-Black hover:text-brand-cream hover:underline hover:cursor-pointer"
          onClick={handleBackClick}
        >
          Back
        </p>
        <Formik
          initialValues={{
            display: "",
            prompt: "",
            assistantId: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true); // Start submitting

            try {
              const token = await getToken();
              await service.adminService.createPrompt(
                token,
                {
                  display: values.display,
                  prompt: values.prompt,
                },
                values.assistantId
              );
              // addPrompt(values);
              navigate("/admin"); // Navigate back on successful submit
            } catch (error) {
              console.error("Failed to submit form", error);
            }

            setSubmitting(false); // Finish submitting
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-4 w-1/2">
              <div>
                <label htmlFor="display" className={labelClass}>
                  Display Text
                </label>
                <Field
                  id="display"
                  name="display"
                  placeholder="Display Text"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="prompt" className={labelClass}>
                  Prompt
                </label>
                <Field
                  id="prompt"
                  name="prompt"
                  placeholder="Prompt"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="assistantId" className={labelClass}>
                  Assistant
                </label>
                <Field
                  as="select"
                  id="assistantId"
                  name="assistantId"
                  className={inputClass}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue("assistantId", e.target.value);
                  }}
                >
                  <option value="" label="Select assistant" />
                  {assistants.map((assistant) => (
                    <option key={assistant._id} value={assistant._id}>
                      {assistant.name}
                    </option>
                  ))}
                </Field>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-4 bg-brand-cream text-brand-green py-2 px-4 rounded-full hover:bg-brand-green-dark hover:text-brand-logo transition duration-300 font-Black ${
                  isSubmitting
                    ? "opacity-50"
                    : "hover:bg-brand-green-dark hover:text-brand-logo"
                } transition-colors duration-300 ease-in-out mt-8`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PromptForm;
