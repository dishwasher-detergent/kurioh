"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProjectImages } from "@/components/ui/project//images";
import { ProjectWebsites } from "@/components/ui/project//websites";
import { ProjectBadges } from "@/components/ui/project/badges";
import { PROJECTS_COLLECTION_ID, database_service } from "@/lib/appwrite";
import { LucidePencil, LucideTrash } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  id: string;
  images: string[];
  badges: string[];
  title: string;
  description: string;
  websites: string[];
}

export const ProjectCard = ({
  id,
  images,
  badges,
  title,
  description,
  websites,
}: ProjectCardProps) => {
  async function deleteProject() {
    await database_service.delete(PROJECTS_COLLECTION_ID, id);
  }

  return (
    <Card>
      <CardContent className="space-y-5 p-4">
        <ProjectImages images={images} />
        <ProjectBadges badges={badges} />
        <div>
          <h4 className="text-xl font-bold">{title}</h4>
          <p>{description}</p>
        </div>
        <ProjectWebsites websites={websites} />
      </CardContent>
      <CardFooter className="flex flex-row justify-end gap-2">
        <Button variant="destructive" onClick={() => deleteProject()}>
          <LucideTrash className="mr-2 h-4 w-4" />
          Delete
        </Button>
        <Button asChild>
          <Link href={`/projects/${id}`}>
            <>
              <LucidePencil className="mr-2 h-4 w-4" />
              Edit
            </>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
