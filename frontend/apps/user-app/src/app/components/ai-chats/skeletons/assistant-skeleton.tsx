import { Skeleton } from "@repo/ui-kit/components/ui/skeleton";

export default function AssistantSkeletonItem() {
  return <Skeleton className="w-[180px] h-[60px] rounded-md bg-white/20" />;
}

export function AssistantSkeletonList() {
  return Array.from({ length: 16 }).map((_, index) => (
    <AssistantSkeletonItem key={index} />
  ));
}
