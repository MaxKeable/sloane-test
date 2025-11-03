import { useState } from 'react';
import { UserStats } from './types';
import UserStatsCard from './UserStatsCard';
import UserDetailView from './UserDetailView';

interface UsersListProps {
    users: UserStats[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const handleUserClick = (userId: string) => {
        setSelectedUserId(userId);
    };

    const handleClose = () => {
        setSelectedUserId(null);
    };

    const selectedUser = users.find(user => user.id === selectedUserId);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <UserStatsCard
                        key={user.id}
                        user={user}
                        onClick={handleUserClick}
                    />
                ))}
            </div>

            {selectedUser && (
                <UserDetailView
                    user={selectedUser}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default UsersList; 