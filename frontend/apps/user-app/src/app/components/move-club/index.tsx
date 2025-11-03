/***********************************************************************
                IMPORTS
***********************************************************************/
import React from "react";
import MoveClubSlides from "./move-club-slides";
import EditorialCountdown from "./EditorialCountdown";
import SaveYourSeatButton from "./save-your-seat";
/***********************************************************************
                Components
***********************************************************************/
const DashboardAdd: React.FC = () => (
  <div className="flex flex-col md:flex-row w-full h-full items-center justify-center gap-8">
    <MoveClubSlides />
    <div className="flex flex-col items-center mt-8 md:mt-0">
      <EditorialCountdown />
      <SaveYourSeatButton />
    </div>
  </div>
);
/***********************************************************************
                EXPORTS
***********************************************************************/
export default DashboardAdd;
/***********************************************************************
                NOTES
***********************************************************************/
// DashboardAdd layout: TallRecAdd left, EditorialCountdown & AddToCalendarButton right.
