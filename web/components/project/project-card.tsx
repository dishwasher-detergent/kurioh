"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Badges } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Images } from "@/components/ui/images";
import { Links } from "@/components/ui/links";
import { Project } from "@/interfaces/project.interface";

export function ProjectCard(project: Project) {
  return (
    <Card className="break-inside-avoid-column gap-4 p-2">
      <CardContent className="p-0">
        <div className="relative min-h-10">
          <Badge variant="secondary" className="absolute top-2 left-2">
            {project.ordinal}
          </Badge>
          {project.published && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Published
            </Badge>
          )}
          {project.images.length > 0 && (
            <div className="mb-2">
              <Images images={project.images} />
            </div>
          )}
        </div>
        {project.tags.length > 0 && <Badges badges={project.tags} />}
        <div className="px-2 py-4">
          <p className="truncate text-xl font-bold">{project.name}</p>
          <p className="line-clamp-3 text-sm">
            {project.description ?? "No Description Added."}
          </p>
        </div>
        {project.links.length > 0 && <Links links={project.links} />}
      </CardContent>
      <CardFooter className="p-0">
        <Button asChild className="w-full" variant="secondary">
          <Link href={`/app/teams/${project.teamId}/projects/${project.$id}`}>
            Edit Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
