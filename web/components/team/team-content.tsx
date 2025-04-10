import { Projects } from "@/components/realtime/projects";
import { Project } from "@/interfaces/project.interface";

interface TeamContentProps {
  projects: Project[];
  teamId: string;
}

export function TeamContent({ projects, teamId }: TeamContentProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Projects</h3>
      <Projects initialProjects={projects} teamId={teamId} />
    </div>
  );
}
