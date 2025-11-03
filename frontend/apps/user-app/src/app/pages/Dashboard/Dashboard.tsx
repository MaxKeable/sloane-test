import DashboardContent from "./DashboardContent/DashboardContent";
import PageWrapper from "@/app/components/core/page-wrapper";
import { useUserContext } from "@/providers/user-provider";

const Dashboard: React.FC = () => {
  const { user } = useUserContext();

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { greeting: "Good Morning", timeContext: "today" };
    } else if (hour >= 12 && hour < 17) {
      return { greeting: "Good Afternoon", timeContext: "today" };
    } else if (hour >= 17 && hour < 22) {
      return { greeting: "Good Evening", timeContext: "tonight" };
    } else {
      return { greeting: "Good Evening", timeContext: "tonight" };
    }
  };

  const { greeting } = getTimeBasedGreeting();

  return (
    <PageWrapper title={`${greeting} ${user?.name},`}>
      <DashboardContent />
    </PageWrapper>
  );
};

export default Dashboard;
