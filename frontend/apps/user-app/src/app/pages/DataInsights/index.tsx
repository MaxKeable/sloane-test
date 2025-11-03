import React, { useState, useEffect, useRef } from "react";
import { UserStats, GoalStats } from "./types";
import {
  FaUsers,
  FaCheckCircle,
  FaFolder,
  FaRobot,
  FaComments,
  FaChartLine,
  FaSignInAlt,
  FaCalendarAlt,
  FaSort,
  FaFilter,
  FaSearch,
  FaCalendarWeek,
  FaCalendar,
  FaRocket,
} from "react-icons/fa";
import { useUser } from "@clerk/clerk-react";
import NotAdmin from "../NotAdmin";
import UserDetailsModal from "./UserDetailsModal";
import toast from "react-hot-toast";
import LoadingSpinner from "../Dashboard/LoadingSpinner";
import CustomAssistantsModal from "./CustomAssistantsModal";
import GoalsModal from "./GoalsModal";
import ActiveUsersModal from "./ActiveUsersModal";
import fetcher from "../../../utils/fetcher";
import DataInsightsCard from "./DataInsightsCard";

// Define sort options
type SortField =
  | "name"
  | "actionsCount"
  | "goalsCount"
  | "foldersCount"
  | "chatsCount"
  | "lastLoginDate"
  | "favoriteAssistant"
  | "customAiUsage";
type SortDirection = "asc" | "desc";

// Add this at the top of the file after imports
const pulseAnimation = `
@keyframes pulse {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    }
    
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
    }
    
    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
}`;

const DataInsights: React.FC = () => {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [totalGoalStats, setTotalGoalStats] = useState<GoalStats>({
    activeWeekly: 0,
    activeMonthly: 0,
    completedThisWeek: 0,
    completedThisMonth: 0,
  });
  const [filteredUsers, setFilteredUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showCustomAssistantsModal, setShowCustomAssistantsModal] =
    useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [allGoals, setAllGoals] = useState<
    {
      title: string;
      userName: string;
      isWeekly: boolean;
      isCompleted: boolean;
    }[]
  >([]);
  const [showActiveUsersModal, setShowActiveUsersModal] = useState<
    "Today" | "This Week" | "This Month" | null
  >(null);

  const tableRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetcher("/api/admin/user-statistics");

        const data = response.data;
        if (isMounted) {
          setUsers(data.users);
          setTotalGoalStats(data.totalGoalStats);
          setFilteredUsers(data.users);
        }
      } catch (err) {
        console.error("Error fetching user statistics:", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to connect to the database. Please try again later."
          );
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to load user statistics"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user?.publicMetadata.account === "admin") {
      fetchData();
    } else {
      setError("Admin access required");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    // Apply search filter
    let result = users || [];
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle special cases
      switch (sortField) {
        case "lastLoginDate":
          aValue = a.lastLoginDate ? new Date(a.lastLoginDate).getTime() : 0;
          bValue = b.lastLoginDate ? new Date(b.lastLoginDate).getTime() : 0;
          break;
        case "favoriteAssistant":
          aValue = a.favoriteAssistant || "";
          bValue = b.favoriteAssistant || "";
          break;
        case "customAiUsage":
          aValue = a.customAiUsage ? 1 : 0;
          bValue = b.customAiUsage ? 1 : 0;
          break;
      }

      // Handle null values
      if (aValue === null || aValue === undefined) aValue = 0;
      if (bValue === null || bValue === undefined) bValue = 0;

      // String comparison for text fields
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Number comparison for numeric fields
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
  }, [users, searchTerm, sortField, sortDirection]);

  const handleUserClick = (user: UserStats) => {
    // Ensure loginCount is properly initialized before opening the modal
    const userWithLoginCount = {
      ...user,
      loginCount: user.loginCount || { today: 0, thisWeek: 0, thisMonth: 0 },
    };
    setSelectedUser(userWithLoginCount);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calculate summary statistics
  const totalUsers = users?.length || 0;
  const totalActions =
    users?.reduce((sum, user) => sum + (user.actionsCount || 0), 0) || 0;
  const totalGoals =
    users?.reduce((sum, user) => sum + (user.goalsCount || 0), 0) || 0;
  const totalFolders =
    users?.reduce((sum, user) => sum + (user.foldersCount || 0), 0) || 0;
  const totalChats =
    users?.reduce((sum, user) => sum + (user.chatsCount || 0), 0) || 0;

  // Calculate login statistics with null checks
  const activeUsersToday =
    users?.reduce((sum, user) => sum + (user.loginCount?.today || 0), 0) || 0;
  const activeUsersThisWeek =
    users?.reduce((sum, user) => sum + (user.loginCount?.thisWeek || 0), 0) ||
    0;
  const activeUsersThisMonth =
    users?.reduce((sum, user) => sum + (user.loginCount?.thisMonth || 0), 0) ||
    0;

  // Add this function to get all custom assistants
  const getAllCustomAssistants = () => {
    const customAssistants: { name: string; userName: string }[] = [];
    users?.forEach((user) => {
      if (user?.topAssistants && Array.isArray(user.topAssistants)) {
        // Filter only custom assistants (where user field exists and name doesn't contain 'Hub')
        const userCustomAssistants = user.topAssistants
          .filter(
            (assistant) =>
              assistant.user && // Has a user ID
              !assistant.name.includes("Hub") && // Not a Hub assistant
              assistant.user.startsWith("user_") // Verify it's a valid user ID
          )
          .map((assistant) => ({
            name: assistant.name,
            userName: user.name || "Unknown User",
          }));
        if (userCustomAssistants.length > 0) {
          customAssistants.push(...userCustomAssistants);
        }
      }
    });
    return customAssistants;
  };

  // Add this function to get all goals
  const getAllGoals = async () => {
    try {
      const baseUrl =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_NEXT_PUBLIC_API_URL || ""
          : "";

      const response = await fetch(`${baseUrl}/api/goals/all`);
      const data = await response.json();

      const mappedGoals = [
        ...data.weeklyGoals.map((goal: any) => ({
          title: goal.title,
          userName: goal.userName,
          isWeekly: true,
          isCompleted: goal.isCompleted,
        })),
        ...data.monthlyGoals.map((goal: any) => ({
          title: goal.title,
          userName: goal.userName,
          isWeekly: false,
          isCompleted: goal.isCompleted,
        })),
      ];

      setAllGoals(mappedGoals);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  // Add this function to get active users for a specific timeframe
  const getActiveUsers = (timeframe: "Today" | "This Week" | "This Month") => {
    return users
      .filter((user) => {
        if (!user.lastLoginDate) return false;
        const lastLogin = new Date(user.lastLoginDate);

        switch (timeframe) {
          case "Today":
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return lastLogin >= today;
          case "This Week":
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return lastLogin >= weekAgo;
          case "This Month":
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return lastLogin >= monthAgo;
          default:
            return false;
        }
      })
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        lastLoginDate: user.lastLoginDate,
      }));
  };

  if (user?.publicMetadata.account !== "admin") {
    return <NotAdmin />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-green p-8">
        <div className="max-w-7xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-green-dark to-brand-green p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white bg-red-500/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <p className="text-lg font-light">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green-dark to-brand-green p-6 md:p-8">
      <style>{pulseAnimation}</style>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-cream mb-8">
          User Insights Dashboard
        </h1>

        {/* Combined Statistics Container */}
        <div className="bg-brand-green-darker/90 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-white/90">
              Sloane Analytics
            </h2>
            <div className="h-[1px] flex-grow mx-4 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="text-sm font-light text-white/60">
              Real-time Overview
            </span>
          </div>

          {/* Platform Overview */}
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-light text-white/70 mb-3 uppercase tracking-wider">
              Platform Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <DataInsightsCard
                icon={(<FaUsers className="text-base" />) as any}
                title="Users"
                value={totalUsers}
                colorIdx={0}
              />
              <DataInsightsCard
                icon={(<FaCheckCircle className="text-base" />) as any}
                title="Actions"
                value={totalActions}
                colorIdx={1}
              />
              <DataInsightsCard
                icon={(<FaFolder className="text-base" />) as any}
                title="Folders"
                value={totalFolders}
                colorIdx={2}
              />
              <DataInsightsCard
                icon={(<FaRocket className="text-base" />) as any}
                title="Goals"
                value={totalGoals}
                colorIdx={3}
                onClick={() => {
                  setShowGoalsModal(true);
                  getAllGoals();
                }}
              />
              <DataInsightsCard
                icon={(<FaComments className="text-base" />) as any}
                title="Chats"
                value={totalChats}
                colorIdx={4}
              />
              <DataInsightsCard
                icon={(<FaRobot className="text-base" />) as any}
                title="Custom AI"
                value={users.reduce((count, user) => {
                  if (
                    user?.topAssistants &&
                    Array.isArray(user.topAssistants)
                  ) {
                    return (
                      count +
                      user.topAssistants.filter(
                        (assistant) =>
                          assistant.user &&
                          !assistant.name.includes("Hub") &&
                          assistant.user.startsWith("user_")
                      ).length
                    );
                  }
                  return count;
                }, 0)}
                colorIdx={5}
                onClick={() => setShowCustomAssistantsModal(true)}
              />
            </div>
          </div>

          {/* Active Users Statistics */}
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-light text-white/70 mb-3 uppercase tracking-wider">
              Active Users
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <DataInsightsCard
                icon={(<FaSignInAlt />) as any}
                title="Today"
                value={activeUsersToday}
                colorIdx={0}
                onClick={() => setShowActiveUsersModal("Today")}
              />
              <DataInsightsCard
                icon={(<FaCalendarAlt />) as any}
                title="This Week"
                value={activeUsersThisWeek}
                colorIdx={1}
                onClick={() => setShowActiveUsersModal("This Week")}
              />
              <DataInsightsCard
                icon={(<FaChartLine />) as any}
                title="This Month"
                value={activeUsersThisMonth}
                colorIdx={2}
                onClick={() => setShowActiveUsersModal("This Month")}
              />
            </div>
          </div>

          {/* Goal Statistics */}
          <div className="bg-white/15 rounded-lg p-4">
            <h3 className="text-sm font-light text-white/70 mb-3 uppercase tracking-wider">
              Goal Tracking
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <DataInsightsCard
                icon={(<FaCalendarWeek />) as any}
                title="Active Weekly"
                value={totalGoalStats?.activeWeekly || 0}
                colorIdx={0}
              />
              <DataInsightsCard
                icon={(<FaCalendarAlt />) as any}
                title="Active Monthly"
                value={totalGoalStats?.activeMonthly || 0}
                colorIdx={1}
              />
              <DataInsightsCard
                icon={(<FaCheckCircle />) as any}
                title="Completed Weekly"
                value={totalGoalStats?.completedThisWeek || 0}
                colorIdx={2}
              />
              <DataInsightsCard
                icon={(<FaCalendar />) as any}
                title="Completed Monthly"
                value={totalGoalStats?.completedThisMonth || 0}
                colorIdx={3}
              />
            </div>
          </div>
        </div>

        {/* Users List Section */}
        <div
          className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/20"
          ref={tableRef}
        >
          <div className="bg-white/5 p-4 border-b border-white/10">
            <h2 className="text-xl font-light text-white">User List</h2>
          </div>

          {/* Search and Filter Controls */}
          <div className="p-4 bg-white/10 border-b border-white/10">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-white/60" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <FaFilter className="text-white/60" />
                <span className="text-sm font-light">Sort by:</span>
                <select
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  value={sortField}
                  onChange={(e) => handleSort(e.target.value as SortField)}
                >
                  <option value="name">Name</option>
                  <option value="actionsCount">Actions</option>
                  <option value="goalsCount">Goals</option>
                  <option value="foldersCount">Folders</option>
                  <option value="chatsCount">Chats</option>
                  <option value="customAiUsage">Custom AI Usage</option>
                  <option value="lastLoginDate">Last Login</option>
                  <option value="favoriteAssistant">Top Assistant</option>
                </select>
                <button
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  onClick={() =>
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }
                >
                  <FaSort
                    className={`text-white/60 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/10">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-light text-white/90 uppercase tracking-wider cursor-pointer hover:bg-white/5"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center justify-between">
                      <span>User</span>
                      {sortField === "name" && (
                        <div className="flex items-center">
                          <FaSort
                            className={`ml-1 transition-transform duration-200 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-light text-white/90 uppercase tracking-wider cursor-pointer hover:bg-white/5"
                    onClick={() => handleSort("actionsCount")}
                  >
                    <div className="flex items-center justify-between">
                      <span>Actions</span>
                      {sortField === "actionsCount" && (
                        <div className="flex items-center">
                          <FaSort
                            className={`ml-1 transition-transform duration-200 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-light text-white/90 uppercase tracking-wider cursor-pointer hover:bg-white/5"
                    onClick={() => handleSort("goalsCount")}
                  >
                    <div className="flex items-center justify-between">
                      <span>Goals</span>
                      {sortField === "goalsCount" && (
                        <div className="flex items-center">
                          <FaSort
                            className={`ml-1 transition-transform duration-200 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-light text-white/90 uppercase tracking-wider cursor-pointer hover:bg-white/5"
                    onClick={() => handleSort("foldersCount")}
                  >
                    <div className="flex items-center justify-between">
                      <span>Folders</span>
                      {sortField === "foldersCount" && (
                        <div className="flex items-center">
                          <FaSort
                            className={`ml-1 transition-transform duration-200 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-light text-white/90 uppercase tracking-wider cursor-pointer hover:bg-white/5"
                    onClick={() => handleSort("chatsCount")}
                  >
                    <div className="flex items-center justify-between">
                      <span>Chats</span>
                      {sortField === "chatsCount" && (
                        <div className="flex items-center">
                          <FaSort
                            className={`ml-1 transition-transform duration-200 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-light text-white/90 uppercase tracking-wider cursor-pointer hover:bg-white/5"
                    onClick={() => handleSort("customAiUsage")}
                  >
                    <div className="flex items-center justify-between">
                      <span>Custom AI</span>
                      {sortField === "customAiUsage" && (
                        <div className="flex items-center">
                          <FaSort
                            className={`ml-1 transition-transform duration-200 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-light text-white/90 uppercase tracking-wider cursor-pointer hover:bg-white/5"
                    onClick={() => handleSort("lastLoginDate")}
                  >
                    <div className="flex items-center justify-between">
                      <span>Last Login</span>
                      {sortField === "lastLoginDate" && (
                        <div className="flex items-center">
                          <FaSort
                            className={`ml-1 transition-transform duration-200 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-light text-white/90 uppercase tracking-wider cursor-pointer hover:bg-white/5"
                    onClick={() => handleSort("favoriteAssistant")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaRobot className="text-white/90" />
                        <span>TOP ASSISTANT</span>
                      </div>
                      {sortField === "favoriteAssistant" && (
                        <div className="flex items-center">
                          <FaSort
                            className={`ml-1 transition-transform duration-200 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-white/10">
                {filteredUsers.map((user) => {
                  // Calculate user status based on last login with proper timezone handling
                  const lastLogin = user.lastLoginDate
                    ? new Date(user.lastLoginDate)
                    : null;
                  const now = new Date();

                  // Set up time boundaries
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  let statusColor = "bg-red-800"; // Darker red for inactive
                  let statusText = "Inactive today";
                  let timeAgo = "Never logged in";

                  if (lastLogin) {
                    const timeDiffMinutes = Math.floor(
                      (now.getTime() - lastLogin.getTime()) / (1000 * 60)
                    );

                    const isActiveToday = lastLogin >= today;

                    // Update status based on time difference
                    if (timeDiffMinutes <= 15) {
                      statusColor = "bg-green-500"; // Keep bright green for active now
                      statusText = "Active now";
                    } else if (timeDiffMinutes <= 60) {
                      statusColor = "bg-orange-400"; // Lighter orange for recent activity
                      statusText = "Active within last hour";
                    } else if (isActiveToday) {
                      statusColor = "bg-orange-400"; // Keep consistent orange for today
                      statusText = "Active today";
                    }

                    // Format time ago display
                    if (timeDiffMinutes < 1) {
                      timeAgo = "Just now";
                    } else if (timeDiffMinutes < 60) {
                      timeAgo = `${timeDiffMinutes} minute${timeDiffMinutes === 1 ? "" : "s"} ago`;
                    } else {
                      const hours = Math.floor(timeDiffMinutes / 60);
                      if (hours < 24 && isActiveToday) {
                        timeAgo = `${hours} hour${hours === 1 ? "" : "s"} ago`;
                      } else {
                        // Format date with time for better accuracy
                        timeAgo = lastLogin.toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      }
                    }
                  }

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-white/10 cursor-pointer transition-colors"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-white/20 rounded-full flex items-center justify-center relative group">
                            <span className="text-white font-light">
                              {user.name.charAt(0)}
                            </span>
                            <div className="relative">
                              <div
                                className={`absolute w-2 h-2 rounded-full ${statusColor} border border-white/20 -top-4 -right-4 group-hover:scale-110 transition-transform duration-200 ${statusColor === "bg-green-500" ? "animate-[pulse_2s_infinite]" : ""}`}
                              ></div>
                              <div className="absolute top-0 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                <div className="bg-brand-green text-brand-cream text-sm py-2 px-3 rounded-lg shadow-lg whitespace-nowrap">
                                  {statusText}
                                  <br />
                                  Last active: {timeAgo}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-light text-white">
                              {user.name}
                            </div>
                            <div className="text-xs text-white/70">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white relative group">
                          <span className="hover:text-white/90 transition-colors">
                            {user.actionsCount}
                          </span>
                          <div className="absolute opacity-0 group-hover:opacity-100 bg-white/20 text-white text-xs px-2 py-1 rounded transition-opacity duration-200 -top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            Actions
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white relative group">
                          <span className="hover:text-white/90 transition-colors">
                            {user.goalsCount}
                          </span>
                          <div className="absolute opacity-0 group-hover:opacity-100 bg-white/20 text-white text-xs px-2 py-1 rounded transition-opacity duration-200 -top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            Goals
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white relative group">
                          <span className="hover:text-white/90 transition-colors">
                            {user.foldersCount}
                          </span>
                          <div className="absolute opacity-0 group-hover:opacity-100 bg-white/20 text-white text-xs px-2 py-1 rounded transition-opacity duration-200 -top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            Folders
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white relative group">
                          <span className="hover:text-white/90 transition-colors">
                            {user.chatsCount}
                          </span>
                          <div className="absolute opacity-0 group-hover:opacity-100 bg-white/20 text-white text-xs px-2 py-1 rounded transition-opacity duration-200 -top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            Chats
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.topAssistants &&
                        user.topAssistants.filter(
                          (assistant) =>
                            assistant.user &&
                            !assistant.name.includes("Hub") &&
                            assistant.user.startsWith("user_")
                        ).length > 0 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-light rounded-full bg-green-500/50 text-green-200 border border-green-400/50">
                            Yes (
                            {
                              user.topAssistants.filter(
                                (assistant) =>
                                  assistant.user &&
                                  !assistant.name.includes("Hub") &&
                                  assistant.user.startsWith("user_")
                              ).length
                            }
                            )
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-light rounded-full bg-red-500/30 text-red-200 border border-red-400/30">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                        {timeAgo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {user.favoriteAssistant ? (
                            <>
                              <FaRobot className="text-white/90 opacity-80" />
                              <span className="text-white">
                                {user.favoriteAssistant}
                              </span>
                            </>
                          ) : (
                            <span className="text-white/50">None</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={closeModal} />
      )}

      {/* Add the CustomAssistantsModal */}
      {showCustomAssistantsModal && (
        <CustomAssistantsModal
          assistants={getAllCustomAssistants()}
          onClose={() => setShowCustomAssistantsModal(false)}
        />
      )}

      {/* Add the GoalsModal */}
      {showGoalsModal && (
        <GoalsModal goals={allGoals} onClose={() => setShowGoalsModal(false)} />
      )}

      {/* Add the ActiveUsersModal */}
      {showActiveUsersModal && (
        <ActiveUsersModal
          users={getActiveUsers(showActiveUsersModal)}
          timeframe={showActiveUsersModal}
          onClose={() => setShowActiveUsersModal(null)}
        />
      )}
    </div>
  );
};

export default DataInsights;
