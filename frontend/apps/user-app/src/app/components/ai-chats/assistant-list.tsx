import { AssistantResponse } from "@backend/types";
import AssistantCard from "./assistant-card";
import { AssistantSkeletonList } from "./skeletons/assistant-skeleton";

type Props = {
  assistants?: AssistantResponse[];
  isLoading: boolean;
};

export default function AssistantList({ assistants, isLoading }: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      {isLoading && <AssistantSkeletonList />}
      {assistants?.map((assistant) => (
        <AssistantCard key={assistant.id} assistant={assistant} />
      ))}
    </div>
  );
}
