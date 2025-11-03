import React from 'react';
import { FaRobot, FaTimes, FaUser } from 'react-icons/fa';

interface CustomAssistant {
    name: string;
    userName: string;
}

interface CustomAssistantsModalProps {
    assistants: CustomAssistant[];
    onClose: () => void;
}

const CustomAssistantsModal: React.FC<CustomAssistantsModalProps> = ({ assistants, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-brand-green-darker rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden border border-white/20">
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-brand-green">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaRobot className="text-2xl text-brand-cream" />
                            <h2 className="text-2xl font-light text-brand-cream">Custom AI Assistants</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {assistants.length === 0 ? (
                        <p className="text-white/70 text-center py-8">No custom assistants found.</p>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {assistants.map((assistant, index) => (
                                <div
                                    key={index}
                                    className="py-3 flex items-center justify-between hover:bg-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaRobot className="text-brand-cream/80 text-sm" />
                                        <span className="text-white text-sm">{assistant.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/60">
                                        <FaUser className="text-xs" />
                                        <span className="text-xs">{assistant.userName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-brand-green">
                    <div className="flex justify-between items-center">
                        <span className="text-white/60 text-xs">
                            Total Custom Assistants: {assistants.length}
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

export default CustomAssistantsModal; 