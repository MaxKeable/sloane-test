import React from 'react';
import { FaTimes, FaSignInAlt, FaEnvelope, FaClock } from 'react-icons/fa';

interface User {
    id: string;
    name: string;
    email: string;
    lastLoginDate: string | null;
}

interface ActiveUsersModalProps {
    users: User[];
    timeframe: 'Today' | 'This Week' | 'This Month';
    onClose: () => void;
}

const ActiveUsersModal: React.FC<ActiveUsersModalProps> = ({ users, timeframe, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black"></div>
            <div className="relative bg-brand-green rounded-xl shadow-xl w-full max-w-4xl mx-4 border border-brand-cream">
                {/* Header */}
                <div className="p-4 border-b border-brand-cream/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaSignInAlt className="text-2xl text-brand-cream" />
                            <h2 className="text-2xl font-light text-brand-cream">Active Users • {timeframe}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-brand-cream hover:text-white transition-colors"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {users.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-brand-cream">No active users found for this timeframe.</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-brand-green-dark">
                                <tr className="text-left text-xs uppercase tracking-wider text-brand-cream">
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3 text-right">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-cream/20">
                                {users.map((user) => {
                                    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
                                    const now = new Date();
                                    let timeAgo = "Never";

                                    if (lastLogin) {
                                        const diffMinutes = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60));

                                        if (diffMinutes < 1) {
                                            timeAgo = "Just now";
                                        } else if (diffMinutes < 60) {
                                            timeAgo = `${diffMinutes}m ago`;
                                        } else {
                                            const hours = Math.floor(diffMinutes / 60);
                                            if (hours < 24) {
                                                timeAgo = `${hours}h ago`;
                                            } else {
                                                timeAgo = lastLogin.toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                });
                                            }
                                        }
                                    }

                                    return (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-brand-green-dark transition-colors text-sm"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-brand-green-dark rounded-full flex items-center justify-center">
                                                        <span className="text-brand-cream">{user.name.charAt(0)}</span>
                                                    </div>
                                                    <span className="text-brand-cream">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="text-brand-cream text-xs" />
                                                    <span className="text-brand-cream">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <FaClock className="text-brand-cream text-xs" />
                                                    <span className="text-brand-cream">{timeAgo}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-brand-cream/50 bg-brand-green-dark rounded-b-xl">
                    <div className="flex justify-between items-center">
                        <span className="text-brand-cream text-sm">
                            Total Active Users: {users.length}
                        </span>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-brand-green hover:bg-brand-green-light text-brand-cream rounded-lg transition-colors text-sm border border-brand-cream"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveUsersModal; 