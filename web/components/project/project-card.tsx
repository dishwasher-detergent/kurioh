"use client";

import { LucideSlash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ProfileLink } from "@/components/profile-link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/interfaces/project.interface";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";

export function ProjectCard(project: Project) {
  return (
    <Card className="break-inside-avoid-column rounded-lg overflow-hidden py-0 gap-0 ">
      <CardContent className="p-0 relative">
        <AspectRatio ratio={1} className="w-full">
          {project.image ? (
            <Image
              src={`${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${project.image}/view?project=${PROJECT_ID}`}
              alt={project.name}
              className="object-cover object-left-top bg-primary"
              fill
            />
          ) : (
            <div className="w-full aspect-square bg-muted grid place-items-center">
              <p className="text-muted-foreground font-semibold">No image</p>
            </div>
          )}
        </AspectRatio>
        <CardHeader className="flex flex-col justify-end bottom-0 absolute w-full p-4 h-full bg-linear-to-t from-primary to-primary/20">
          <CardTitle className="text-primary-foreground">
            <Button
              className="truncate p-0! text-primary-foreground text-xl"
              variant="link"
              asChild
            >
              <Link
                href={`/app/teams/${project.teamId}/projects/${project.$id}`}
              >
                {project.name}
              </Link>
            </Button>
          </CardTitle>
          <CardDescription className="text-primary-foreground line-clamp-3">
            {project?.description ?? "No description provided."}
          </CardDescription>
          <div className="flex flex-row gap-2 items-center mt-2">
            <ProfileLink
              name={project?.team?.name}
              href={`/app/teams/${project.teamId}`}
            />
            <LucideSlash className="text-primary-foreground size-3" />
            <ProfileLink
              name={project?.user?.name}
              href={`/app/users/${project.userId}`}
            />
          </div>
        </CardHeader>
      </CardContent>
    </Card>
  );
}
