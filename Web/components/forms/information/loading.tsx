"use client";

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function InformationFormLoading() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Skeleton className="h-8 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Title your portfolio.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Skeleton className="h-24 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Describe your portfolio here.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Image</Label>
        <Skeleton className="h-24 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Make your portfolio stand out with a striking image.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Socials</Label>
        <Skeleton className="h-8 w-full" />
        <p className="text-[0.8rem] text-muted-foreground">
          Add social media links to your portfolio.
        </p>
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
