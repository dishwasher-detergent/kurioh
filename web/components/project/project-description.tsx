import { Project } from "@/interfaces/project.interface";

interface ProjectDescriptionProps {
  project: Project;
}

export function ProjectDescription({ project }: ProjectDescriptionProps) {
  return (
    <div className="max-w-prose">
      <h1 className="text-2xl font-bold tracking-tight mb-1">{project.name}</h1>
      <section aria-label="About">
        <p className="text-muted-foreground leading-relaxed">
          {project.description ?? "No description for this project."}
        </p>
      </section>
    </div>
  );
}
