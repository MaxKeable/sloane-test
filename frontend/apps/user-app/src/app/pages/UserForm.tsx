import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { service } from "../../services";
import { useAuth } from "@clerk/clerk-react";
import EastIcon from "@mui/icons-material/East";
import Modal from "../components/Modal";
import CreateUserMenu from "./CreateUserMenu";
import LoadingSpinner from "./Dashboard/LoadingSpinner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";

/******************************************************************************************
                                    COMPONENT START
******************************************************************************************/

const UserForm: React.FC = () => {
  const { getToken } = useAuth();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /******************************************************************************************
                                TIMER FOR INFO MODAL
******************************************************************************************/

  useEffect(() => {
    const timer = setTimeout(() => {
      setInfoModalOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  /******************************************************************************************
                          HANDLE SUBMIT
  /******************************************************************************************/
  const handleSubmit = async (values: any, actions: any) => {
    setIsSubmitting(true);

    // Show toast immediately
    toast.success("Thank you 😎! Please wait for your next step...", {
      duration: 4000,
      position: "bottom-right",
      style: {
        background: "#004B27",
        color: "#C1FF72",
        borderRadius: "10px",
        padding: "16px",
      },
    });

    let token;
    try {
      token = await getToken();
      console.log("Form submitted", values);

      // Make.com webhook submission
      const response = await fetch(
        "https://hook.us1.make.com/v86njfp8t8xn647op9x1tiuu27wkmdgd",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Webhook submission failed with status: ${response.status}`
        );
      }

      const redirectURL = await service.adminService.createUser(token, values);
      setTimeout(() => {
        window.location.replace(redirectURL);
      }, 1000);
    } catch (error) {
      console.error(
        "Unfortunately we experienced a bit of an error. Please email hello@sloane.biz with your name and business name & mobile so we can finalise your submission.",
        error
      );
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
      actions.setSubmitting(false);
    }
  };

  /******************************************************************************************
                                  INPUT STYLING
******************************************************************************************/

  const inputClass =
    "my-4 block w-full py-2 px-4 border border-brand-logo rounded-full bg-transparent text-brand-green-dark placeholder-green-700 focus:border-brand-green-dark outline-none";
  const inputClass2 =
    "my-4 block w-full px-4 py-3 border border-brand-logo rounded-[35px] bg-transparent text-brand-green-dark placeholder-green-700 overflow-hidden focus:border-brand-green-dark outline-none h-[150px]";
  const labelClass = "block text-brand-logo font-bold mb-2";

  /******************************************************************************************
                                  RENDER COMPONENT
******************************************************************************************/

  return (
    <div className="bg-brand-green flex justify-center items-center min-h-screen w-full px-4 ">
      <CreateUserMenu />
      <div className="hidden lg:flex w-1/2 bg-brand-green justify-center items-center">
        <div className="w-3/5 h-full ">
          <img
            src="/images/signup.png"
            alt="Signup"
            className="object-cover w-full h-full -ml-4"
          />
        </div>
        <div className="w-2/5 h-full flex items-center ml-4">
          <h1 className="leading-none text-brand-logo text-6xl">
            Let's<br></br>make<br></br>biz a<br></br>breeze.
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-8 w-full lg:w-1/2 h-full pt-24 md:pt-16">
        <div className="mb-8 ml-8 flex w-full justify-center gap-12 font-Black lg:gap-16">
          <div className=" text-brand-green-dark bg-brand-logo flex  h-8 w-8 items-center justify-center rounded-full">
            1
          </div>
          <div className="bg-brand-cream opacity-30 text-brand-green-dark flex  h-8 w-8 items-center justify-center rounded-full">
            2
          </div>
          <div className=" text-brand-green-dark bg-brand-cream opacity-30 flex  h-8 w-8 items-center justify-center rounded-full">
            3
          </div>
          <div className=" text-brand-green-dark bg-brand-cream opacity-30 flex  h-8 w-8 items-center justify-center rounded-full">
            4
          </div>
        </div>
        <h2 className="text-xl lg:text-4xl font-bold mb-4 text-brand-green-dark w-full">
          Create Your Profile
        </h2>
        <Formik
          initialValues={{
            name: "",
            email: "",
            mobile: "",
            affiliate: "",
            businessProfile: {
              businessName: "",
              businessType: "",
              businessSize: "",
              businessURL: "",
              businessDescription: "",
            },
          }}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4 w-full">
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col w-full md:w-1/2 md:pr-8">
                  <div>
                    <label htmlFor="name" className={labelClass}></label>
                    <Field
                      id="name"
                      name="name"
                      placeholder="First name*"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}></label>
                    <Field
                      id="email"
                      name="email"
                      placeholder="Work email*"
                      type="email"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="mobile" className={labelClass}></label>
                    <PhoneInput
                      country={"au"}
                      value={values.mobile}
                      onChange={(phone) => setFieldValue("mobile", "+" + phone)}
                      containerClass="phone-input-container"
                      inputClass={inputClass}
                      inputStyle={{
                        width: "100%",
                        height: "42px",
                        backgroundColor: "transparent",
                        border: "1px solid #C1FF72",
                        borderRadius: "9999px",
                        color: "#000",
                      }}
                      buttonStyle={{
                        backgroundColor: "transparent",
                        border: "1px solid #C1FF72",
                        borderRight: "none",
                        borderRadius: "9999px 0 0 9999px",
                      }}
                      masks={{
                        au: "... ... ...",
                        us: "... ... ....",
                        gb: ".... ......",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="businessProfile.businessName"
                      className={labelClass}
                    ></label>
                    <Field
                      id="businessProfile.businessName"
                      name="businessProfile.businessName"
                      placeholder="Business name*"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:w-1/2">
                  <div>
                    <label
                      htmlFor="businessProfile.businessType"
                      className={labelClass}
                    ></label>
                    <Field
                      id="businessProfile.businessType"
                      name="businessProfile.businessType"
                      placeholder="Profession*"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="businessProfile.businessSize"
                      className={labelClass}
                    ></label>
                    <Field
                      id="businessProfile.businessSize"
                      name="businessProfile.businessSize"
                      placeholder="Number of employees*"
                      type="number"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="businessProfile.businessURL"
                      className={labelClass}
                    ></label>
                    <Field
                      id="businessProfile.businessURL"
                      name="businessProfile.businessURL"
                      placeholder="URL*"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="affiliate" className={labelClass}></label>
                    <Field
                      id="affiliate"
                      name="affiliate"
                      placeholder="Sign Up Code"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="businessProfile.businessDescription"
                  className={labelClass}
                ></label>
                <Field
                  as="textarea"
                  id="businessProfile.businessDescription"
                  name="businessProfile.businessDescription"
                  placeholder="List at least one area of your business you're wanting Sloane's help*"
                  className={inputClass2}
                  multiline
                />
                <div className="relative">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center text-brand-green-dark py-2 px-4 rounded-md justify-end w-full hover:text-brand-logo hover:underline ${
                      isSubmitting ? "opacity-50" : ""
                    } transition-colors duration-300 ease-in-out`}
                  >
                    {isSubmitting ? "Submitting" : "Continue"}
                    <span></span>
                    <EastIcon className="ml-2 hover:text-brand-logo text-brand-green-dark " />
                  </button>
                  {isSubmitting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
              </div>
            </Form>
          )}
        </Formik>

        <Modal isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
          <h2 className="text-xl font-Archivo mb-4 text-brand-green">
            Whoops Error
          </h2>
          <p className="text-brand-green-dark mb-4">
            There was an error submitting your form. <br></br>
            <br></br> Please send us an email with your name, business name &
            mobile number to <span className="font-bold">hello@sloane.biz</span>{" "}
            so we can finalise your submission. Don't forget your country code
            in the mobile number 😎
          </p>
        </Modal>

        <Modal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)}>
          <h2 className="text-2xl font-Black text-brand-green">
            This is Exciting!
          </h2>
          <p className="text-brand-green-dark mb-4">
            After filling out this form, there are{" "}
            <span className="font-bold">2 more steps</span> to complete your
            sign-up:
          </p>
          <ul className="list-disc pl-6 my-2 text-brand-green-dark">
            <li>Create your Stripe subscription</li>
            <li>Book your time for our 1:1 Deep Dive interview</li>
          </ul>
          <p className="text-brand-green-dark mt-4">
            Last but not least, you'll receive an email with some things to
            prepare.
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default UserForm;
