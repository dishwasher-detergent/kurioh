import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucidePencil, LucideTrash } from "lucide-react";

export const ProjectLoading = () => {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 space-y-4 p-4">
        <Skeleton className="aspect-square w-full" />
        <Skeleton className="h-6 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-12 w-full" />
      </CardContent>
      <CardFooter className="flex flex-row justify-end gap-2 border-t p-4 dark:border-slate-800">
        <Button variant="destructive" disabled={true}>
          <LucideTrash className="mr-2 h-4 w-4" />
          Delete
        </Button>
        <Button disabled={true}>
          <LucidePencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};
