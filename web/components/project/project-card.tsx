"use client";

import Link from "next/link";

import { Badges } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Images } from "@/components/ui/images";
import { Links } from "@/components/ui/links";
import { Project } from "@/interfaces/project.interface";

export function ProjectCard(project: Project) {
  return (
    <Card className="break-inside-avoid-column rounded-md p-4">
      <CardHeader className="p-0">
        <CardDescription className="truncate text-sm">
          {project.slug}
        </CardDescription>
        <CardTitle>
          <Button
            asChild
            variant="link"
            className="p-0 text-xl font-semibold truncate"
          >
            <Link href={`/app/teams/${project.teamId}/projects/${project.$id}`}>
              {project.name}
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-0">
        {project.images && <Images images={project.images} />}
        {project.links && <Links links={project.links} />}
        {project.tags && <Badges badges={project.tags} />}
        <p className="rounded-xl p-1 text-sm line-clamp-3">
          {project.description}
        </p>
      </CardContent>
    </Card>
  );
}
