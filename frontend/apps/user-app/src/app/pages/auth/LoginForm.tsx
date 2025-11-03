import { SignIn } from "@clerk/clerk-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginComponent: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  if (!showSignIn) {
    return (
      <div className="flex flex-col items-center justify-center mx-auto -mt-20 md:mt-0 w-[360px] md:w-[400px]">
        <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 shadow-b-md">
            {/* Logo section */}
            <div className="text-center mb-6">
              <div className="inline-block px-3  bg-brand-green rounded-full">
                <span className="text-brand-logo font-Black">sloane.</span>
              </div>
            </div>

            {/* Welcome section */}
            <div className="text-center mb-8">
              <h2 className="text-[19px] font-semibold text-brand-green-dark">
                Welcome
              </h2>
              <p className="mt-2 text-[14px] text-gray-600">
                Choose how you'd like to continue
              </p>
            </div>

            {/* Buttons section */}
            <div className="space-y-4">
              <button
                onClick={() => setShowSignIn(true)}
                className="w-full border border-brand-green-dark py-2 px-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/70 transition-colors duration-200 font-medium shadow-md"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/sign-up")}
                className="w-full py-2 px-4 bg-white text-brand-green border border-brand-green rounded-md hover:bg-brand-green/10 transition-colors duration-200 font-medium shadow-md"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Pricing section with different background */}
          <div className="bg-gray-100 p-2 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              <span className="font-bold block mb-1">14 Day Free Trial</span>
              $79/month after trial. Cancel Anytime.
            </p>
          </div>

          {/* Add a second secvtion here that says Secured by Clerk and use the clerk logo before it */}
          <div className="flex justify-center items-center p-2 bg-gray-100 border-t border-gray-200">
            <p>🔒</p>
            <p className="text-center text-sm text-gray-600">
              Secured by Clerk
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SignIn
      signUpUrl="/sign-up"
      redirectUrl="/dashboard"
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "rounded-lg shadow-sm",
          formFieldLabel: {
            "& span": {
              display: "none",
            },
          },
        },
      }}
    />
  );
};

export default LoginComponent;
