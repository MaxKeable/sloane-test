import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import logo from "../Images/logo.png";
import TimerWrapper from "../Pomodoro/TimerWrapper";
import { useTimer } from "../../../context/TimerContext";
import { StripeService } from "../../../services/stripe";
import { useUserContext } from "../../../providers/user-provider";

const MenuBar: React.FC = () => {
  const { user: clerkUser } = useUser();
  const { user } = useUserContext();

  const { isTimerVisible } = useTimer();

  // Determine the route based on whether the user is an admin
  const adminRoute = "/admin";
  const userDashboardRoute = "/dashboard";
  const targetRoute =
    clerkUser?.publicMetadata.account === "admin" ? adminRoute : userDashboardRoute;

  const DotIcon = () => {
    return (
      <svg
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        className="cl-userButtonPopoverActionButtonIcon cl-userButtonPopoverActionButtonIcon__manageAccount 🔒️ cl-internal-kjkbhu"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.559 2.536A.667.667 0 0 1 7.212 2h1.574a.667.667 0 0 1 .653.536l.22 1.101c.466.178.9.429 1.287.744l1.065-.36a.667.667 0 0 1 .79.298l.787 1.362a.666.666 0 0 1-.136.834l-.845.742c.079.492.079.994 0 1.486l.845.742a.666.666 0 0 1 .137.833l-.787 1.363a.667.667 0 0 1-.791.298l-1.065-.36c-.386.315-.82.566-1.286.744l-.22 1.101a.666.666 0 0 1-.654.536H7.212a.666.666 0 0 1-.653-.536l-.22-1.101a4.664 4.664 0 0 1-1.287-.744l-1.065.36a.666.666 0 0 1-.79-.298L2.41 10.32a.667.667 0 0 1 .136-.834l.845-.743a4.7 4.7 0 0 1 0-1.485l-.845-.742a.667.667 0 0 1-.137-.833l.787-1.363a.667.667 0 0 1 .791-.298l1.065.36c.387-.315.821-.566 1.287-.744l.22-1.101ZM7.999 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        ></path>
      </svg>
    );
  };

  const customerId = user?.stripeCustomerId;

  const handleManageAccount = async () => {
    try {
      const data: any = await StripeService.createPortalSession(customerId);
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe portal
      }
    } catch (error) {
      console.error("Error redirecting to Stripe portal:", error);
      alert("Error opening portal. Please try again.");
    } finally {
    }
  };

  return (
    <div className="fixed top-1 left-0 w-full z-50 h-contain mx:h-[150px] flex items-center justify-between px-2 md:px-4">
      {/* Mobile Logo */}
      <div className="lg:hidden absolute left-1/2 -translate-x-1/2 w-28 h-auto pt-2">
        <Link to={targetRoute}>
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </Link>
      </div>

      {/* Right Section with Timer and User Button */}
      <div className="flex items-center gap-4 ml-auto pt-2 pr-2 lg:pr-0 lg:pt-0 ">
        <div className="hidden lg:block -mt-14 -mr-2">
          {isTimerVisible && <TimerWrapper />}
        </div>

        {/* User Button with Custom Menu Item */}
        <div>
          <UserButton>
            {customerId !== "" && (
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Payment Details"
                  labelIcon={<DotIcon />}
                  onClick={() => handleManageAccount()}
                />
              </UserButton.MenuItems>
            )}
          </UserButton>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
