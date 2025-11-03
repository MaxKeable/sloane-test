import { useUser } from "@clerk/clerk-react";
import Square from "../Square";
import Square2 from "../Square2";
import CreateAITile from "./CreateAITile";
import { IAssistant } from "../../../../types/interfaces";
import { useAssistants } from "../../../../hooks/useAssistants";

interface AssistantsGridProps {
  onNewAssistant?: () => void;
}

const AssistantsGrid: React.FC<AssistantsGridProps> = ({ onNewAssistant }) => {
  const { assistants } = useAssistants();
  const { user } = useUser();

  const standardAssistants = assistants.filter((assistant) => !assistant.user);

  const customAssistants = assistants.filter(
    (assistant) => assistant.user === user?.id
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Create AI Expert Skeleton Tile - First */}
      {onNewAssistant && <CreateAITile onNewAssistant={onNewAssistant} />}

      {/* Standard Assistants */}
      {standardAssistants &&
        standardAssistants.map((assistant: IAssistant, index: number) => (
          <div
            key={index}
            className="w-[160px] sm:w-[200px] md:w-[220px] lg:w-[210px] h-[100px] sm:h-[110px] md:h-[120px] relative mx-auto"
          >
            <Square
              title={assistant.jobTitle}
              description={assistant.description}
              _id={assistant._id}
            />
          </div>
        ))}

      {/* Custom Assistants Section - Only show if user has custom assistants */}
      {customAssistants.length > 0 && (
        <>
          {customAssistants.map((assistant: IAssistant, index: number) => (
            <div
              key={`custom-${index}`}
              className="w-[160px] sm:w-[200px] md:w-[220px] lg:w-[210px] h-[100px] sm:h-[110px] md:h-[120px] relative mx-auto"
            >
              <Square2
                title={assistant.jobTitle}
                description={assistant.description}
                _id={assistant._id}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AssistantsGrid;
