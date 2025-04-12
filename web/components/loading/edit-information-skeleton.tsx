import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "../ui/label";

export function EditInformationSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <div className="relative">
          <Skeleton className="h-9 w-full" />
          <Badge
            className="absolute top-1/2 right-1.5 -translate-y-1/2"
            variant="secondary"
          >
            0/64
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <div className="relative">
          <Skeleton className="h-24 w-full" />
          <Badge className="absolute bottom-2 left-2" variant="secondary">
            0/512
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Image</Label>
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Label>Socials</Label>
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-8 w-32" />
    </div>
  );
}
