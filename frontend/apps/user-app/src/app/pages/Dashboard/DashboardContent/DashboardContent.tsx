import { MoveClub, GoalsSection } from "./index";
import { FeatureFlagEnabled } from "@/app/components/core";

const DashboardContent = () => {
  return (
    <div className="flex flex-col gap-6">
      <FeatureFlagEnabled featureName="MOVE_CLUB">
        <MoveClub />
      </FeatureFlagEnabled>
      <GoalsSection />
    </div>
  );
};

export default DashboardContent;
