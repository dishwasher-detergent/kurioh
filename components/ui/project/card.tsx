import { LucidePencil, LucideTrash } from "lucide-react";
import { Button } from "../button";
import { Card, CardContent, CardFooter } from "../card";
import { ProjectBadges } from "./badges";
import { ProjectWebsites } from "./websites";

interface ProjectCardProps {
  image: string;
  badges: string[];
  title: string;
  description: string;
  websites: string[];
}

export const ProjectCard = ({
  image,
  badges,
  title,
  description,
  websites,
}: ProjectCardProps) => {
  return (
    <Card>
      <CardContent className="space-y-5 p-4">
        <img
          src={image}
          className="aspect-video w-full rounded-lg object-cover object-left-top"
        />
        <ProjectBadges badges={badges} />
        <div>
          <h4 className="text-xl font-bold">{title}</h4>
          <p>{description}</p>
        </div>
        <ProjectWebsites websites={["https://github.com/test"]} />
      </CardContent>
      <CardFooter className="flex flex-row justify-end gap-2">
        <Button variant="destructive">
          <LucideTrash className="mr-2 h-4 w-4" />
          Delete
        </Button>
        <Button>
          <LucidePencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};
