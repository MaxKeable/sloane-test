import { UserStats } from './types';
import StatisticItem from './StatisticItem';
import { FaFolder, FaRobot, FaCheckCircle, FaComments, FaBullseye, FaCog } from 'react-icons/fa';

interface UserStatsCardProps {
    user: UserStats;
    onClick: (userId: string) => void;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ user, onClick }) => {
    return (
        <div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => onClick(user.id)}
        >
            <div className="mb-4">
                <h2 className="text-xl font-bold text-brand-green">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <StatisticItem
                    label="Actions"
                    value={user.actionsCount}
                    icon={<FaCog />}
                    lastUpdate={user.lastActionDate}
                />
                <StatisticItem
                    label="Goals"
                    value={user.goalsCount}
                    icon={<FaBullseye />}
                    lastUpdate={user.lastGoalDate}
                />
                <StatisticItem
                    label="Folders"
                    value={user.foldersCount}
                    icon={<FaFolder />}
                />
                <StatisticItem
                    label="Custom AI"
                    value={user.customAiUsage ? 'Yes' : 'No'}
                    icon={<FaRobot />}
                />
                <StatisticItem
                    label="Q&A Updates"
                    value="View"
                    icon={<FaCheckCircle />}
                    lastUpdate={user.lastQuestionAnswerUpdate}
                />
                <StatisticItem
                    label="Chats"
                    value={user.chatsCount}
                    icon={<FaComments />}
                />
            </div>
        </div>
    );
};

export default UserStatsCard; 