"use client";

import { Badges } from "@/components/ui/badges";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Images } from "@/components/ui/images";
import { Links } from "@/components/ui/links";
import { Project } from "@/interfaces/project.interface";
import Link from "next/link";
import { Button } from "../ui/button";

export function ProjectCard(project: Project) {
  return (
    <Card className="break-inside-avoid-column rounded-md p-2">
      <CardContent className="p-0">
        {project.images && <Images images={project.images} />}
        <div className="mt-2 p-2 space-y-2 ">
          <p className="font-bold text-lg">{project.name}</p>
          {project.tags && <Badges badges={project.tags} />}
          <p className="text-sm line-clamp-3">{project.description}</p>
          {project.links && <Links links={project.links} />}
        </div>
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
