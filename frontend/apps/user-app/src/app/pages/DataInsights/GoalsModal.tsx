import React, { useState } from 'react';
import { FaTimes, FaRocket, FaUser, FaCalendarWeek, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

interface Goal {
    title: string;
    userName: string;
    isWeekly: boolean;
    isCompleted: boolean;
}

interface GoalsModalProps {
    goals: Goal[];
    onClose: () => void;
}

const GoalsModal: React.FC<GoalsModalProps> = ({ goals, onClose }) => {
    const [weeklyExpanded, setWeeklyExpanded] = useState(true);
    const [monthlyExpanded, setMonthlyExpanded] = useState(true);

    const weeklyGoals = goals.filter(goal => goal.isWeekly);
    const monthlyGoals = goals.filter(goal => !goal.isWeekly);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-brand-green-darker rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col border border-white/20">
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-brand-green rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaRocket className="text-2xl text-brand-cream" />
                            <h2 className="text-2xl font-light text-brand-cream">Platform Goals</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 overflow-y-auto flex-grow bg-brand-green-darker">
                    {goals.length === 0 ? (
                        <p className="text-white/70 text-center py-8">No goals found.</p>
                    ) : (
                        <div className="space-y-6">
                            {/* Weekly Goals */}
                            <div className="bg-brand-green/20 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setWeeklyExpanded(!weeklyExpanded)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <FaCalendarWeek className="text-brand-cream/80" />
                                        <h3 className="text-lg font-light text-brand-cream">Weekly Goals ({weeklyGoals.length})</h3>
                                    </div>
                                    <FaChevronDown
                                        className={`text-brand-cream/80 transition-transform ${weeklyExpanded ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {weeklyExpanded && (
                                    <div className="divide-y divide-white/10">
                                        {weeklyGoals.map((goal, index) => (
                                            <div
                                                key={index}
                                                className="p-4 hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm ${goal.isCompleted ? 'text-green-400' : 'text-white'}`}>
                                                            {goal.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/60">
                                                        <FaUser className="text-xs" />
                                                        <span className="text-xs">{goal.userName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Monthly Goals */}
                            <div className="bg-brand-green/20 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setMonthlyExpanded(!monthlyExpanded)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-brand-cream/80" />
                                        <h3 className="text-lg font-light text-brand-cream">Monthly Goals ({monthlyGoals.length})</h3>
                                    </div>
                                    <FaChevronDown
                                        className={`text-brand-cream/80 transition-transform ${monthlyExpanded ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {monthlyExpanded && (
                                    <div className="divide-y divide-white/10">
                                        {monthlyGoals.map((goal, index) => (
                                            <div
                                                key={index}
                                                className="p-4 hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm ${goal.isCompleted ? 'text-green-400' : 'text-white'}`}>
                                                            {goal.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/60">
                                                        <FaUser className="text-xs" />
                                                        <span className="text-xs">{goal.userName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-brand-green rounded-b-2xl flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <span className="text-white/60 text-xs">
                            Total Goals: {goals.length} ({weeklyGoals.length} Weekly, {monthlyGoals.length} Monthly)
                        </span>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalsModal; 