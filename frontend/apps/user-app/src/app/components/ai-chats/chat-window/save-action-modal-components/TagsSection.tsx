import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface TagsSectionProps {
    tags: Array<{ text: string; color: string }>;
    newTag: { text: string; color: string };
    onNewTagChange: (tag: { text: string; color: string }) => void;
    onAddTag: () => void;
    onRemoveTag: (index: number) => void;
    isMobile: boolean;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
    tags,
    newTag,
    onNewTagChange,
    onAddTag,
    onRemoveTag,
    isMobile,
}) => (
    <>
        {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 rounded-full flex items-center gap-2"
                        style={{ backgroundColor: tag.color }}
                    >
                        {tag.text}
                        <button onClick={() => onRemoveTag(index)}>
                            <FaTimes size={12} />
                        </button>
                    </span>
                ))}
            </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
            <input
                type="text"
                value={newTag.text}
                onChange={(e) => onNewTagChange({ ...newTag, text: e.target.value })}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && newTag.text.trim()) {
                        e.preventDefault();
                        onAddTag();
                    }
                }}
                className="flex-1 p-2 rounded-lg bg-brand-green-dark/20 text-brand-cream placeholder-brand-cream/50"
                placeholder="Add a tag (press Enter)"
            />
            <button
                onClick={onAddTag}
                className="px-4 py-2 bg-brand-green text-brand-cream rounded-lg hover:bg-brand-green-dark transition-colors"
            >
                Add Tag
            </button>
        </div>
    </>
); 