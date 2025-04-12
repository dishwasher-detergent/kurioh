import { Skeleton } from "@/components/ui/skeleton";

interface MultiUserSkeletonProps {
  title: string;
}

export function MultiUserSkeleton({ title }: MultiUserSkeletonProps) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <div className="flex -space-x-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className="border-background size-10 rounded-full border-2"
          />
        ))}
      </div>
    </section>
  );
}
