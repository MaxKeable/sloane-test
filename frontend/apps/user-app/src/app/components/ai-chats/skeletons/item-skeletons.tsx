import { Skeleton } from "@repo/ui-kit/components/ui/skeleton";

export default function ItemSkeletons() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full h-10 rounded-md bg-white/20" />
      <Skeleton className="w-full h-10 rounded-md bg-white/20" />
      <Skeleton className="w-full h-10 rounded-md bg-white/20" />
    </div>
  );
}
