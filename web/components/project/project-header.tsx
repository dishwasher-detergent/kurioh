import { ProjectActions } from "@/components/project/project-actions";
import { Header } from "@/components/ui/header";
import { Project } from "@/interfaces/project.interface";
import { ENDPOINT, PROJECT_BUCKET_ID, PROJECT_ID } from "@/lib/constants";

interface ProjectHeaderProps {
  project: Project;
  canEdit: boolean;
}

export function ProjectHeader({ project, canEdit }: ProjectHeaderProps) {
  return (
    <Header
      src={
        project.image
          ? `${ENDPOINT}/storage/buckets/${PROJECT_BUCKET_ID}/files/${project.image}/view?project=${PROJECT_ID}`
          : undefined
      }
      alt={`${project.name}'s project image`}
    >
      {canEdit && <ProjectActions project={project} />}
    </Header>
  );
}
