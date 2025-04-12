import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SHORT_DESCRIPTION_MAX_LENGTH,
} from "@/constants/project.constants";

export function EditProjectSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Project Name</Label>
        <div className="relative">
          <Skeleton className="h-9 w-full" />
          <Badge
            className="absolute top-1/2 right-1.5 -translate-y-1/2"
            variant="secondary"
          >
            0/{NAME_MAX_LENGTH}
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <div className="relative">
          <Skeleton className="h-24 w-full" />
          <Badge className="absolute bottom-2 left-2" variant="secondary">
            0/{DESCRIPTION_MAX_LENGTH}
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Short Description</Label>
        <div className="relative">
          <Skeleton className="h-16 w-full" />
          <Badge className="absolute bottom-2 left-2" variant="secondary">
            0/{SHORT_DESCRIPTION_MAX_LENGTH}
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Images</Label>
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Label>Tags</Label>
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Label>Links</Label>
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-8 w-32" />
    </div>
  );
}
