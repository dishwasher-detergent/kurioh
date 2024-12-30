import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md border border-primary/25 bg-primary/10",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
