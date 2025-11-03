import React from 'react';
import { UserStats } from './types';
import { FaRobot } from 'react-icons/fa';

interface UsersListProps {
    users: UserStats[];
    onUserClick: (user: UserStats) => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, onUserClick }) => {
    const formatDate = (date: string | null) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-brand-green-darker bg-opacity-30 rounded-lg">
                <thead>
                    <tr className="text-left text-brand-cream">
                        <th className="p-4">Name</th>
                        <th className="p-4">Actions</th>
                        <th className="p-4">Goals</th>
                        <th className="p-4">Folders</th>
                        <th className="p-4">Chats</th>
                        <th className="p-4">Last Login</th>
                        <th className="p-4">
                            <div className="flex items-center gap-2">
                                <FaRobot className="text-brand-cream" />
                                <span>Favorite Assistant</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr
                            key={user.id}
                            onClick={() => onUserClick(user)}
                            className="text-brand-cream hover:bg-brand-green-dark hover:bg-opacity-30 cursor-pointer transition-colors"
                        >
                            <td className="p-4">{user.name}</td>
                            <td className="p-4">{user.actionsCount}</td>
                            <td className="p-4">{user.goalsCount}</td>
                            <td className="p-4">{user.foldersCount}</td>
                            <td className="p-4">{user.chatsCount}</td>
                            <td className="p-4">{formatDate(user.lastLoginDate)}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    {user.favoriteAssistant ? (
                                        <>
                                            <FaRobot className="text-brand-cream opacity-80" />
                                            <span>{user.favoriteAssistant}</span>
                                        </>
                                    ) : (
                                        <span className="text-brand-cream opacity-50">None</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersList; 