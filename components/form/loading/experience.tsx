import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideLoader2 } from "lucide-react";

export const ExperienceFormLoading = () => {
  return (
    <div className="w-full">
      <div>
        <Skeleton className="h-48 w-full" />
      </div>
      <footer className="flex w-full flex-row justify-end gap-2">
        <Button disabled={true} type="button" variant="destructive">
          Reset
        </Button>
        <Button disabled={true}>
          <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
          Save
        </Button>
      </footer>
    </div>
  );
};
