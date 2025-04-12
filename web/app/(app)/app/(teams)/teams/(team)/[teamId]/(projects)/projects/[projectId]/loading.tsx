import { EditProjectSkeleton } from "@/components/loading/edit-project-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <header className="mb-6 flex flex-row justify-between">
        <div>
          <Skeleton className=" mb-1 h-8 w-1/3" />
          <p className="text-sm font-semibold">
            Describe your project and its goals.
          </p>
        </div>
        <Skeleton className="h-8 w-8" />
      </header>
      <EditProjectSkeleton />
    </>
  );
}
