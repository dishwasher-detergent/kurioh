import { MultiCardSkeleton } from "@/components/loading/multi-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <header className="mb-6 flex flex-row justify-between">
        <div>
          <Skeleton className=" mb-1 h-8 w-1/3" />
          <p className="text-sm font-semibold">
            All projects created in this team.
          </p>
        </div>
        <Skeleton className="h-8 w-8" />
      </header>
      <MultiCardSkeleton />
    </>
  );
}
