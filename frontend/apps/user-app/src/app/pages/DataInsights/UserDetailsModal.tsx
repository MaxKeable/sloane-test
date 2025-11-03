import React from 'react';
import { UserStats } from './types';
import { FaTimes, FaEnvelope, FaCheckCircle, FaFolder, FaRobot, FaComments, FaChartLine, FaCalendarAlt, FaSignInAlt, FaRocket, FaStar, FaCalendarWeek } from 'react-icons/fa';

interface UserDetailsModalProps {
    user: UserStats;
    onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
    // Format date helper
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Default values for login counts if they don't exist
    const loginCount = user.loginCount || { today: 0, thisWeek: 0, thisMonth: 0 };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-brand-green-dark/90 to-brand-green/90 backdrop-blur-md rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
                {/* Modal Header */}
                <div className="bg-brand-green p-4 border-b border-white/10 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-xl font-light text-white tracking-wide">User Details</h2>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {/* User Profile Section */}
                    <div className="flex items-center mb-6 pb-6 border-b border-white/10">
                        <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mr-6">
                            <span className="text-white/90 text-2xl font-light">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-light text-white/90">{user.name}</h3>
                            <div className="flex items-center text-white/70 mt-1">
                                <FaEnvelope className="mr-2 text-white/60" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Login Activity Section */}
                    <div className="mb-6">
                        <h4 className="text-sm font-light text-white/80 mb-4 uppercase tracking-wider">Login Activity</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <div className="flex items-center mb-2">
                                    <FaSignInAlt className="text-white/70 mr-2" />
                                    <h5 className="font-light text-white/80 text-sm">Today</h5>
                                </div>
                                <p className="text-xl font-light text-white">{loginCount.today}</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <div className="flex items-center mb-2">
                                    <FaCalendarAlt className="text-white/70 mr-2" />
                                    <h5 className="font-light text-white/80 text-sm">This Week</h5>
                                </div>
                                <p className="text-xl font-light text-white">{loginCount.thisWeek}</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <div className="flex items-center mb-2">
                                    <FaChartLine className="text-white/70 mr-2" />
                                    <h5 className="font-light text-white/80 text-sm">This Month</h5>
                                </div>
                                <p className="text-xl font-light text-white">{loginCount.thisMonth}</p>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-white/60">
                            <p>Last Login: {formatDate(user.lastLoginDate)}</p>
                        </div>
                    </div>

                    {/* Goals Section */}
                    <div className="bg-brand-green-darker bg-opacity-30 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold text-brand-cream mb-4 flex items-center gap-2">
                            <FaRocket className="text-brand-cream" />
                            Goals Overview
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-brand-green-dark bg-opacity-30 p-4 rounded-lg">
                                <h4 className="text-brand-cream font-medium mb-3 flex items-center gap-2">
                                    <FaCalendarWeek />
                                    Weekly Goals
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-brand-cream opacity-80">Active Goals</span>
                                        <span className="text-brand-cream font-medium">{user.goalStats.activeWeekly}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-brand-cream opacity-80">Completed This Week</span>
                                        <span className="text-brand-cream font-medium">{user.goalStats.completedThisWeek}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-brand-green-dark bg-opacity-30 p-4 rounded-lg">
                                <h4 className="text-brand-cream font-medium mb-3 flex items-center gap-2">
                                    <FaCalendarAlt />
                                    Monthly Goals
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-brand-cream opacity-80">Active Goals</span>
                                        <span className="text-brand-cream font-medium">{user.goalStats.activeMonthly}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-brand-cream opacity-80">Completed This Month</span>
                                        <span className="text-brand-cream font-medium">{user.goalStats.completedThisMonth}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-brand-green-dark bg-opacity-20 rounded-lg">
                            <div className="flex items-center gap-2 text-brand-cream">
                                <FaCheckCircle className={user.goalStats.activeWeekly > 0 ? "text-green-400" : "text-brand-cream opacity-50"} />
                                <span>{user.goalStats.activeWeekly > 0 ? `${user.goalStats.activeWeekly} active goals this week` : "No active goals this week"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                            <div className="flex items-center mb-2">
                                <div className="bg-white/10 p-2 rounded-full mr-3">
                                    <FaCheckCircle className="text-white/80" />
                                </div>
                                <h4 className="text-sm font-light text-white/80 uppercase tracking-wider">Actions</h4>
                            </div>
                            <p className="text-xl font-light text-white">{user.actionsCount}</p>
                            {user.lastActionDate && (
                                <p className="text-xs text-white/60 mt-1">
                                    Last action: {formatDate(user.lastActionDate)}
                                </p>
                            )}
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                            <div className="flex items-center mb-2">
                                <div className="bg-white/10 p-2 rounded-full mr-3">
                                    <FaChartLine className="text-white/80" />
                                </div>
                                <h4 className="text-sm font-light text-white/80 uppercase tracking-wider">Goals</h4>
                            </div>
                            <p className="text-xl font-light text-white">{user.goalsCount}</p>
                            {user.lastGoalDate && (
                                <p className="text-xs text-white/60 mt-1">
                                    Last goal update: {formatDate(user.lastGoalDate)}
                                </p>
                            )}
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                            <div className="flex items-center mb-2">
                                <div className="bg-white/10 p-2 rounded-full mr-3">
                                    <FaFolder className="text-white/80" />
                                </div>
                                <h4 className="text-sm font-light text-white/80 uppercase tracking-wider">Folders</h4>
                            </div>
                            <p className="text-xl font-light text-white">{user.foldersCount}</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                            <div className="flex items-center mb-2">
                                <div className="bg-white/10 p-2 rounded-full mr-3">
                                    <FaComments className="text-white/80" />
                                </div>
                                <h4 className="text-sm font-light text-white/80 uppercase tracking-wider">Chats</h4>
                            </div>
                            <p className="text-xl font-light text-white">{user.chatsCount}</p>
                        </div>
                    </div>

                    {/* AI Assistants Section */}
                    {user.topAssistants.length > 0 && (
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 mb-6">
                            <h4 className="text-sm font-light text-white/80 mb-3 uppercase tracking-wider">Top AI Assistants</h4>
                            <div className="grid gap-4">
                                {user.topAssistants.map((assistant, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {index === 0 && <FaStar className="text-yellow-400" />}
                                            <span className="text-white/80 font-medium">{assistant.name}</span>
                                        </div>
                                        <span className="text-white/60">{assistant.useCount} chats</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10">
                        <h4 className="text-sm font-light text-white/80 mb-3 uppercase tracking-wider">Additional Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <FaRobot className="text-white/70 mr-2" />
                                <span className="text-white/80 text-sm">Custom AI Usage:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-light ${user.customAiUsage ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/60'}`}>
                                    {user.customAiUsage ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FaCalendarAlt className="text-white/70 mr-2" />
                                <span className="text-white/80 text-sm">Last Activity:</span>
                                <span className="ml-2 text-white/60 text-sm">
                                    {formatDate(user.lastQuestionAnswerUpdate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Custom AI Usage Section */}
                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-light text-white/70 uppercase tracking-wider">Custom AI Usage</h3>
                            {user.topAssistants && user.topAssistants.filter(assistant =>
                                assistant.user &&
                                !assistant.name.includes('Hub') &&
                                assistant.user.startsWith('user_')
                            ).length > 0 ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-light rounded-full bg-green-500/50 text-green-200 border border-green-400/50">
                                    {user.topAssistants.filter(assistant =>
                                        assistant.user &&
                                        !assistant.name.includes('Hub') &&
                                        assistant.user.startsWith('user_')
                                    ).length} Custom Assistant{user.topAssistants.filter(assistant =>
                                        assistant.user &&
                                        !assistant.name.includes('Hub') &&
                                        assistant.user.startsWith('user_')
                                    ).length !== 1 ? 's' : ''}
                                </span>
                            ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-light rounded-full bg-red-500/30 text-red-200 border border-red-400/30">
                                    No Custom Assistants
                                </span>
                            )}
                        </div>
                        <div className="space-y-2 mt-4">
                            {user.topAssistants && user.topAssistants
                                .filter(assistant =>
                                    assistant.user &&
                                    !assistant.name.includes('Hub') &&
                                    assistant.user.startsWith('user_')
                                )
                                .map((assistant, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-white/10">
                                        <div className="flex items-center gap-2">
                                            <FaRobot className="text-brand-cream/80" />
                                            <span className="text-white">{assistant.name}</span>
                                        </div>
                                        <span className="text-white/60 text-sm">
                                            Used {assistant.useCount} time{assistant.useCount !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                ))}
                            {(!user.topAssistants || user.topAssistants.filter(assistant =>
                                assistant.user &&
                                !assistant.name.includes('Hub') &&
                                assistant.user.startsWith('user_')
                            ).length === 0) && (
                                    <p className="text-white/60 text-sm py-2">No custom assistants created</p>
                                )}
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <h4 className="text-sm font-light text-white/80 mb-3 uppercase tracking-wider">Activity Timeline</h4>
                        <div className="space-y-4">
                            {user.lastLoginDate && (
                                <div className="flex">
                                    <div className="w-2 h-2 bg-white/30 rounded-full mt-2"></div>
                                    <div className="ml-4">
                                        <p className="text-sm font-light text-white/80">Last Login</p>
                                        <p className="text-xs text-white/60">{formatDate(user.lastLoginDate)}</p>
                                    </div>
                                </div>
                            )}
                            {user.lastActionDate && (
                                <div className="flex">
                                    <div className="w-2 h-2 bg-white/30 rounded-full mt-2"></div>
                                    <div className="ml-4">
                                        <p className="text-sm font-light text-white/80">Last Action</p>
                                        <p className="text-xs text-white/60">{formatDate(user.lastActionDate)}</p>
                                    </div>
                                </div>
                            )}
                            {user.lastGoalDate && (
                                <div className="flex">
                                    <div className="w-2 h-2 bg-white/30 rounded-full mt-2"></div>
                                    <div className="ml-4">
                                        <p className="text-sm font-light text-white/80">Last Goal Update</p>
                                        <p className="text-xs text-white/60">{formatDate(user.lastGoalDate)}</p>
                                    </div>
                                </div>
                            )}
                            {user.lastQuestionAnswerUpdate && (
                                <div className="flex">
                                    <div className="w-2 h-2 bg-white/30 rounded-full mt-2"></div>
                                    <div className="ml-4">
                                        <p className="text-sm font-light text-white/80">Last Question Answer</p>
                                        <p className="text-xs text-white/60">{formatDate(user.lastQuestionAnswerUpdate)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-white/5 p-4 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-light"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal; 