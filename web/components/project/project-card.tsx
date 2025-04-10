"use client";

import { LucideEdit } from "lucide-react";
import Link from "next/link";

import { Badges } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Images } from "@/components/ui/images";
import { Links } from "@/components/ui/links";
import { Project } from "@/interfaces/project.interface";

export function ProjectCard(project: Project) {
  return (
    <Card className="break-inside-avoid-column rounded-md">
      <CardHeader>
        <CardDescription className="truncate text-sm">
          {project.slug}
        </CardDescription>
        <CardTitle className="truncate text-xl">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {project.images && <Images images={project.images} />}
        {project.links && <Links links={project.links} />}
        {project.tags && <Badges badges={project.tags} />}
        <p className="rounded-lg p-1 text-sm">{project.short_description}</p>
      </CardContent>
      <CardFooter className="flex flex-row gap-1">
        <Button asChild className="flex-1" size="sm" variant="outline">
          <Link href={`/app/teams/${project.teamId}/projects/${project.$id}`}>
            <LucideEdit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
