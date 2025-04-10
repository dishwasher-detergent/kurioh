import { ProfileLink } from "@/components/profile-link";
import { Project } from "@/interfaces/project.interface";

interface ProjectCreatorProps {
  project: Project;
}

export function ProjectCreator({ project }: ProjectCreatorProps) {
  return <ProfileLink className="text-foreground" name={project?.user?.name} />;
}
