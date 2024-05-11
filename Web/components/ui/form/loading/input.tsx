import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingInputProps {
  title: string;
  className?: string;
}

export const LoadingInput = ({ title, className }: LoadingInputProps) => {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </p>
      <Skeleton className={cn("h-8 w-full", className)} />
    </div>
  );
};
