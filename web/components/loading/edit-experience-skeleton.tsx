import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EXPERIENCE_COMPANY_MAX_LENGTH,
  EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  EXPERIENCE_TITLE_MAX_LENGTH,
} from "@/constants/experience.constants";
import { Label } from "../ui/label";

export function EditExperienceSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(2)].map((_, index) => (
        <Card key={index} className="relative overflow-hidden p-0 gap-0">
          <CardHeader className="p-4">
            <div className="flex-1">
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-5 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Skeleton className="h-9 w-full" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
          <CardFooter className="border-t flex justify-between p-2">
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      ))}
      <div className="flex flex-row gap-2 mt-6">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>
    </div>
  );
}
