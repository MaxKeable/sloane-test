import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import { service } from "../../services";
import { useAuth, useUser } from "@clerk/clerk-react";
import NotAdmin from "./NotAdmin";
import Select, { MultiValue } from "react-select";

interface AssistantFormProps {
  isUpdate: boolean;
}

interface OptionType {
  value: string;
  label: string;
}

const AssistantForm: React.FC<AssistantFormProps> = ({ isUpdate }) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { _id } = useParams<{ _id: string }>();
  const [assistantData, setAssistantData] = useState<any>(null);
  const [allAssistants, setAllAssistants] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssistantDetails = async () => {
      if (isUpdate && _id) {
        try {
          const data = await service.assistantService.getAssistant(
            await getToken(),
            _id
          );
          setAssistantData(data);
        } catch (error) {
          console.error("Failed to fetch assistant details", error);
        }
      }
      const assistants = await service.assistantService.getAssistants(
        await getToken()
      );
      setAllAssistants(assistants);
    };
    fetchAssistantDetails();
  }, [isUpdate, _id, getToken]);

  const inputClass =
    "my-4 block w-full py-2 px-4 border border-brand-logo rounded-full bg-transparent text-brand-green-dark placeholder-green-700 focus:border-brand-green-dark outline-none";
  const inputClass2 =
    "my-4 block w-full px-4 py-3 border border-brand-logo rounded-[30px] bg-transparent text-brand-green-dark placeholder-green-700 scrollbar-hide focus:border-brand-green-dark outline-none h-[100px]";
  const inputClass3 =
    "my-4 block w-full px-4 py-3 border border-brand-logo rounded-[30px] bg-transparent text-brand-green-dark placeholder-green-700 scrollbar-hide focus:border-brand-green-dark outline-none h-[400px]";
  const labelClass = "block text-brand-logo font-bold mb-2";
  const handleBackClick = () => {
    navigate(-1); // Takes the user back to the previous page
  };

  if (user?.publicMetadata.account !== "admin") {
    return <NotAdmin />;
  }

  return (
    <div className="bg-brand-green min-h-screen">
      <div className="flex flex-col justify-center items-center w-screen-1 py-8 h-full max-w-[1440px] mx-auto">
        <h2 className="text-xl lg:text-4xl font-Black mb-4 text-brand-cream">
          {isUpdate ? "Update Ai Assistant" : "Create Ai Assistant"}
        </h2>
        <p
          className="text-brand-green-dark font-Black hover:text-brand-cream hover:underline hover:cursor-pointer"
          onClick={handleBackClick}
        >
          Back
        </p>
        <Formik
          initialValues={{
            name: assistantData?.name || "",
            image: assistantData?.image || "",
            description: assistantData?.description || "",
            jobTitle: assistantData?.jobTitle || "",
            basePrompt: assistantData?.basePrompt || "",
            relatedAssistants:
              assistantData?.relatedAssistants?.map(
                (assistant: any) => assistant._id
              ) || [], // Add related assistants to initial values
          }}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true); // Start submitting

            console.log("Form values:", values); // Log the form values before submission

            if (Object.values(values).some((value) => value === "")) {
              alert("All fields need to be completed");
              setSubmitting(false); // Stop submitting if any field is empty
              return;
            }

            try {
              if (isUpdate) {
                await service.adminService.updateAssistant(
                  await getToken(),
                  values,
                  _id
                );
              } else {
                await service.adminService.createAssistant(
                  await getToken(),
                  values
                );
              }
              navigate("/admin"); // Navigate back on successful submit
            } catch (error) {
              console.error("Failed to submit form", error);
            }

            setSubmitting(false); // Finish submitting
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4 w-1/2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="Name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="image" className={labelClass}>
                  Image URL
                </label>
                <Field
                  id="image"
                  name="image"
                  placeholder="http://example.com/image.jpg"
                  type="url"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Description"
                  className={inputClass2}
                />
              </div>

              <div>
                <label htmlFor="jobTitle" className={labelClass}>
                  Job Title
                </label>
                <Field
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="Job Title"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="basePrompt" className={labelClass}>
                  Base Prompt
                </label>
                <Field
                  as="textarea"
                  id="basePrompt"
                  name="basePrompt"
                  placeholder="Base Prompt"
                  className={inputClass3}
                />
              </div>

              <div className=" bg-brand-green">
                <label htmlFor="relatedAssistants" className={labelClass}>
                  Related Assistants
                </label>
                <Select
                  className={inputClass}
                  id="relatedAssistants"
                  name="relatedAssistants"
                  isMulti
                  options={allAssistants.map((assistant) => ({
                    value: assistant._id,
                    label: assistant.jobTitle,
                  }))}
                  value={values.relatedAssistants.map((assistantId: string) => {
                    const assistant = allAssistants.find(
                      (assistant) => assistant._id === assistantId
                    );
                    return { value: assistantId, label: assistant?.jobTitle };
                  })}
                  onChange={(selectedOptions: MultiValue<OptionType>) =>
                    setFieldValue(
                      "relatedAssistants",
                      selectedOptions.map((option: OptionType) => option.value)
                    )
                  }
                />
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

export default AssistantForm;
