import BlueGradient from "../../components/Images/Gradient2.svg";
import MenuBar from "../../components/Menu/MenuBar";
import { SignUp, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const signupFormStyle = {
  backgroundImage: `url(${BlueGradient})`,
  backgroundSize: "cover",
};

function SignUpPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (isSignedIn) {
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={signupFormStyle}>
      <div>
        <MenuBar />
      </div>
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="w-full min-h-screen flex flex-col lg:flex-row justify-center items-center">
          {/* Left Col */}
          <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center">
            {/* desktop view */}
            <div className="w-1/2 hidden lg:block">
              <h1 className="leading-none text-left font-black  text-brand-logo">
                <span className="leading-none text-left text-9xl">
                  sloane<span className="font-raleway -ml-2">.</span>
                </span>
              </h1>
            </div>
          </div>

          {/* Right Col signup*/}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative">
            <div className="w-full px-4 mr-6">
              <SignUp
                redirectUrl="/subscription"
                signInUrl="/"
                appearance={{
                  elements: {
                    rootBox: "mx-auto mt-20",
                    card: "rounded-lg shadow-sm",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
