import { Button } from "@repo/ui-kit/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui-kit/components/ui/card";
import { FaTasks } from "react-icons/fa";
import { Link } from "react-router-dom";

export const GoalsSidebar = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FaTasks className="text-brand-cream size-4" />
          <CardTitle>Goals</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p>Track your progress</p>
        <p>Weekly Goals 1/4</p>
        <p>Monthly Goals 1/4</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button size={"sm"} variant={"secondary"} asChild>
          <Link to="/dashboard">View All</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
