"use client";

import { LucideEdit, LucideLoader2, LucideTrash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
import { deleteProject } from "@/lib/server/utils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteProject(id: string) {
    setIsDeleting(true);

    const data = await deleteProject(id);

    if (data.success) {
      toast.success("Project deleted successfully");
      router.refresh();
    }

    if (!data.success) {
      toast.error(data.message);
    }

    setIsDeleting(false);
  }

  return (
    <Card className="break-inside-avoid-column rounded-md">
      <CardHeader>
        <CardDescription className="truncate text-sm">{slug}</CardDescription>
        <CardTitle className="truncate text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Images images={image_ids} />
        <Links links={links} />
        <Badges badges={tags} />
        <p className="rounded-lg p-1 text-sm">{short_description}</p>
      </CardContent>
      <CardFooter className="flex flex-row gap-1">
        <Button asChild className="flex-1" size="sm" variant="outline">
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
