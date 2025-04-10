import { Projects } from "@/components/realtime/projects";
import { Project } from "@/interfaces/project.interface";

interface UserContentProps {
  projects: Project[];
  userId: string;
}

export function UserContent({ projects, userId }: UserContentProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Projects</h3>
      <Projects initialProjects={projects} userId={userId} />
    </div>
  );
}
