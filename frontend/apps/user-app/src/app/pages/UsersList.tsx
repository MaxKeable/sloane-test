// src/components/UsersList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

interface User {
  _id: string;
  name: string;
  businessProfile: {
    businessName: string;
  };
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { getToken } = useAuth();

  const handleBackClick = () => {
    window.history.back(); // Takes the user back to the previous page
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/get-users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [getToken]);

  return (
    <div className="bg-brand-green w-full h-full min-h-screen">
      <div className="p-8 max-w-[1440px] mx-auto pt-16">
        <h2 className="text-6xl font-bold text-center text-brand-cream mb-4">
          Select a User to View All Chats
        </h2>
        <p className="mb-4 text-center text-2xl px-8 text-brand-cream">
          Look at what you've created!
        </p>
        <p
          className="text-brand-green-dark font-Black hover:text-brand-cream hover:underline hover:cursor-pointer text-center mb-8"
          onClick={handleBackClick}
        >
          Back
        </p>
        <ul className="flex gap-8 flex-wrap justify-center items-center">
          {users.map((user) => (
            <li
              key={user._id}
              className="mb-2 relative bg-brand-logo w-[150px] h-[100px] text-center rounded-3xl shadow-lg text-brand-green flex flex-col justify-center items-center hover:bg-brand-cream hover:text-brand-green hover:shadow-2xl hover:scale-110 active:text-brand-green-logo active:cursor-pointer p-2 transform transition-transform ease-in-out duration-300"
            >
              <Link
                to={`/get-chats/${user._id}`}
                className="font-Black text-xl text-brand-green hover:text-brand-green-logo active:text-brand-green-logo leading-none"
              >
                {user.name}
                <br />
                <span className="text-[12px] font-Raleway text-brand-green-dark leading-none">
                  {user.businessProfile.businessName}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UsersList;
