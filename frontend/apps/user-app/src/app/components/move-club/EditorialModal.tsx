import React from 'react';
import { EditorialModal } from './AddModal';

const EditorialModalWrapper: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    return <EditorialModal isOpen={isOpen} onClose={onClose} />;
};

export default EditorialModalWrapper; 