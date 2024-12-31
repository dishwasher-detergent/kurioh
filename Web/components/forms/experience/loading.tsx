"use client";

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExperienceFormLoading() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Company</Label>
        <Skeleton className="h-8 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          The company you work for.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Skeleton className="h-8 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          The title you held while working here.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Skeleton className="h-24 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Describe what you did in this organization.
        </p>
      </div>
      <div className="w-full space-y-2">
        <div className="flex flex-row gap-2">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <p className="text-[0.8rem] text-muted-foreground">
          Leave the end date empty if you are still working here.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Skills</Label>
        <Skeleton className="h-24 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Skills that you have learned or used in this organization.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Website</Label>
        <Skeleton className="h-24 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Your companies website.
        </p>
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
