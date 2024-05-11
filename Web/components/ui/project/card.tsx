"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DynamicDrawer } from "@/components/ui/dynamic-drawer";
import { ProjectImages } from "@/components/ui/project//images";
import { ProjectWebsites } from "@/components/ui/project//websites";
import { ProjectBadges } from "@/components/ui/project/badges";
import { database_service } from "@/lib/appwrite";
import { PROJECTS_COLLECTION_ID } from "@/lib/constants";
import { usePortfolioStore } from "@/store/zustand";
import { LucidePencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ProjectCardProps {
  id: string;
  slug: string;
  images: string[];
  badges: string[];
  title: string;
  description: string;
  websites: string[];
}

export const ProjectCard = ({
  id,
  slug,
  images,
  badges,
  title,
  description,
  websites,
}: ProjectCardProps) => {
  const { current } = usePortfolioStore();
  async function deleteProject() {
    try {
      await database_service.delete(PROJECTS_COLLECTION_ID, id);

      toast.success(`Project ${title} deleted successfully.`);
    } catch (err) {
      toast.message("An error occurred while deleting your project.");
    }
  }

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 space-y-4 p-4">
        <ProjectImages images={images} />
        <ProjectBadges badges={badges} />
        <div>
          <h4 className="text-xl font-bold capitalize">{title}</h4>
          <p>{description}</p>
        </div>
        <ProjectWebsites websites={websites} />
      </CardContent>
      <CardFooter className="flex flex-row justify-end gap-2">
        <div className="flex-1">
          <DynamicDrawer
            title="Are you sure absolutely sure?"
            buttonText="Delete"
          >
            <div className="flex flex-col gap-4">
              <p>
                This action cannot be undone. This will permanently delete this
                project.
              </p>
              <div className="md:flex md:justify-end">
                <Button variant="destructive" onClick={deleteProject}>
                  Delete
                </Button>
              </div>
            </div>
          </DynamicDrawer>
        </div>
        <Button asChild>
          <Link href={`/portfolio/${current?.id}/projects/${slug}`}>
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
