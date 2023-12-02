import { ProjectCard } from "@/components/ui/project/card";

export default function Projects() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold">Projects</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <ProjectCard />
      </div>
    </div>
  );
}
