"use client";

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectFormLoading() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Project</Label>
        <Skeleton className="h-8 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Name your project.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Skeleton className="h-48 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Describe your project here.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Short Description</Label>
        <Skeleton className="h-24 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Give your projects elevator pitch here.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <Skeleton className="h-24 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Let people, at a glance, know how you&apos;ve built your project.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <Skeleton className="h-8 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Let people, at a glance, know how you&apos;ve built your project.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Links</Label>
        <Skeleton className="h-8 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Add links to your projects site, repo, or anything else.
        </p>
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
