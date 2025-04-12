import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EXPERIENCE_COMPANY_MAX_LENGTH,
  EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  EXPERIENCE_TITLE_MAX_LENGTH,
} from "@/constants/experience.constants";

export function EditExperienceSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(2)].map((_, index) => (
        <Card key={index} className="relative gap-0 overflow-hidden p-0">
          <CardHeader className="p-4">
            <div className="flex-1">
              <Skeleton className="mb-1 h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company</Label>
                <div className="relative">
                  <Skeleton className="h-9 w-full" />
                  <Badge
                    className="absolute top-1/2 right-1.5 -translate-y-1/2"
                    variant="secondary"
                  >
                    0/{EXPERIENCE_COMPANY_MAX_LENGTH}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <div className="relative">
                  <Skeleton className="h-9 w-full" />
                  <Badge
                    className="absolute top-1/2 right-1.5 -translate-y-1/2"
                    variant="secondary"
                  >
                    0/{EXPERIENCE_TITLE_MAX_LENGTH}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <div className="relative">
                <Skeleton className="h-24 w-full" />
                <Badge className="absolute bottom-2 left-2" variant="secondary">
                  0/{EXPERIENCE_DESCRIPTION_MAX_LENGTH}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Skeleton className="h-9 w-full" />
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Skeleton className="h-4 w-4" />I currently work here
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Label>Company Website</Label>
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-2">
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      ))}
      <div className="mt-6 flex flex-row gap-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>
    </div>
  );
}
