import React from 'react';

interface CreateAITileProps {
    onNewAssistant?: () => void;
}

const CreateAITile: React.FC<CreateAITileProps> = ({ onNewAssistant }) => {
    return (
        <div className="w-[160px] sm:w-[200px] md:w-[220px] lg:w-[210px] h-[100px] sm:h-[110px] md:h-[120px] relative mx-auto">
            <div
                className="w-full h-full bg-brand-green rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-brand-green-mid/30 transition-all duration-300 group relative overflow-hidden"
                onClick={onNewAssistant}
            >
                {/* Animated Border */}
                <div
                    className="absolute inset-0 rounded-2xl border-2 border-dashed border-brand-cream/30 animate-pulse"
                    style={{
                        animationDuration: '2s',
                        animationTimingFunction: 'ease-in-out'
                    }}
                ></div>
                <div className="text-brand-cream/50 group-hover:text-brand-cream transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center mb-2">
                        <div className="w-3 h-0.5 bg-current rounded-full"></div>
                        <div className="w-0.5 h-3 bg-current rounded-full absolute"></div>
                    </div>
                </div>
                <div className="text-brand-cream/80 group-hover:text-brand-cream text-sm font-medium text-center transition-colors duration-300">
                    Create AI Expert
                </div>
            </div>
        </div>
    );
};

export default CreateAITile; 