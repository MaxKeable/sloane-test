import LoginForm from "./LoginForm";
import BlueGradient from "../../components/Images/Gradient2.svg";
import MenuBar from "../../components/Menu/MenuBar";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../Dashboard/LoadingSpinner";
import { useUserContext } from "@/providers/user-provider";

const signupFormStyle = {
  backgroundImage: `url(${BlueGradient})`,
  backgroundSize: "cover",
};

function WelcomePage() {
  const { isLoading, isAuthenticated } = useUserContext();

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#4b8052]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={signupFormStyle}>
      <div>
        <MenuBar />
      </div>

      <div className="flex-grow flex items-center justify-center py-8">
        <div className="max-w-[1440px] w-full mx-auto px-4">
          <div className="w-full flex flex-col lg:flex-row justify-center items-center">
            {/* Left Col */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center mb-8 lg:mb-0">
              {/* mobile view */}
              <div className="w-full lg:hidden flex flex-col justify-center items-center">
                <h1 className="leading-none text-center text-7xl text-brand-logo">
                  <span className="hidden leading-none text-center">
                    sloane<span className="font-raleway -ml-2">.</span>
                  </span>
                </h1>
              </div>

              {/* desktop view */}
              <div className="w-1/2 hidden lg:block">
                <h1 className="leading-none text-left font-black text-brand-logo">
                  <span className="hidden lg:block leading-none text-left text-9xl">
                    sloane<span className="font-raleway -ml-2">.</span>
                  </span>
                </h1>
              </div>
            </div>

            {/* Right Col login*/}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center">
              <div className=" flex justify-center">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
