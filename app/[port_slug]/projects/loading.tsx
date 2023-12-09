import { Badge } from "@/components/ui/badge";
import { ProjectLoading } from "@/components/ui/project/loading";

export default async function ProjectsLoading() {
  const randomLength = Math.floor(Math.random() * 25);
  const emptyArray = Array.from({ length: randomLength });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex flex-row items-center gap-2 text-2xl font-bold">
        Projects
        <Badge variant="secondary">{randomLength}</Badge>
      </h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {emptyArray.map((x, i) => (
          <ProjectLoading key={i} />
        ))}
      </div>
    </div>
  );
}
