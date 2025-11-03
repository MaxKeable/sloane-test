import { useState, useEffect } from "react";
import { UserStats } from "./types";
import UsersList from "./UsersList";
import StatisticItem from "./StatisticItem";
import { FaUsers, FaCheckCircle, FaFolder } from "react-icons/fa";

const DataInsights = () => {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/admin/user-statistics");
      if (!response.ok) throw new Error("Failed to fetch user statistics");

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-green p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            Loading user statistics...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-green p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white bg-red-500 p-4 rounded-lg">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter(
    (u) =>
      u.lastActionDate &&
      new Date(u.lastActionDate) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const totalActions = users.reduce((sum, user) => sum + user.actionsCount, 0);
  const totalFolders = users.reduce((sum, user) => sum + user.foldersCount, 0);

  return (
    <div className="min-h-screen bg-brand-green p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-cream mb-8">
          Data Insights
        </h1>

        {/* Overall Statistics */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-brand-green mb-4">
            Overall Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatisticItem
              label="Total Users"
              value={users.length}
              icon={(<FaUsers />) as any}
            />
            <StatisticItem
              label="Active Users (30d)"
              value={activeUsers.length}
              icon={(<FaUsers />) as any}
            />
            <StatisticItem
              label="Total Actions"
              value={totalActions}
              icon={(<FaCheckCircle />) as any}
            />
            <StatisticItem
              label="Total Folders"
              value={totalFolders}
              icon={(<FaFolder />) as any}
            />
          </div>
        </div>

        {/* User List */}
        <UsersList users={users} />
      </div>
    </div>
  );
};

export default DataInsights;
