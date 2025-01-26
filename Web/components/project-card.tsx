"use client";

import { LucideEdit, LucideLoader2, LucideTrash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
import { deleteProject } from "@/lib/utils";

export default function ProjectCard({
  $id,
  title,
  short_description,
  tags,
  image_ids,
  links,
  slug,
  organization_id,
}: Project) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteProject(id: string) {
    setIsDeleting(true);

    await deleteProject(id);

    setIsDeleting(false);
  }

  return (
    <Card className="overflow-hidden transition-all hover:border-primary hover:ring hover:ring-primary/10">
      <CardHeader>
        <CardDescription className="text-xs">{slug}</CardDescription>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Images images={image_ids} />
        <Links links={links} />
        <Badges badges={tags} />
        <p className="rounded-lg p-1 text-sm">{short_description}</p>
      </CardContent>
      <CardFooter className="flex flex-row gap-1">
        <Button asChild className="flex-1" size="sm" variant="secondary">
          <Link href={`/organization/${organization_id}/project/${$id}`}>
            <LucideEdit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          size="icon"
          className="size-8"
          variant="destructive"
          onClick={() => handleDeleteProject($id)}
        >
          {isDeleting ? (
            <LucideLoader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LucideTrash className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
