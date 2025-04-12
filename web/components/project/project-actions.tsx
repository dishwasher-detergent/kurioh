import { LucideEllipsisVertical } from "lucide-react";

import { DeleteProject } from "@/components/project/delete-project";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/interfaces/project.interface";

interface ProjectActionsProps {
  project: Project;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="size-8">
          <LucideEllipsisVertical className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DeleteProject project={project} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
