import { UserStats } from './types';
import { FaTimes } from 'react-icons/fa';

interface UserDetailViewProps {
    user: UserStats;
    onClose: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-green">{user.name}'s Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Detailed statistics sections will go here */}
                    <section>
                        <h3 className="text-xl font-semibold mb-4">Activity Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* We'll add more detailed statistics here */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600">Total Actions</p>
                                <p className="text-2xl font-bold text-brand-green">{user.actionsCount}</p>
                            </div>
                            {/* Add more detailed stats as needed */}
                        </div>
                    </section>

                    {/* We can add more sections here for different types of data */}
                    <section>
                        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                        {/* Add timeline or recent activity list */}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserDetailView; 