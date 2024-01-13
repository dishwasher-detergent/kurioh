import { Badge } from "@/components/ui/badge";
import { ProjectLoading } from "@/components/ui/project/loading";

export default async function ProjectsLoading() {
  const randomLength = Math.floor(Math.random() * 25);
  const emptyArray = Array.from({ length: randomLength });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <header className="py-4">
        <h3 className="flex flex-row items-center gap-2 text-2xl font-bold">
          Projects
          <Badge variant="secondary">{randomLength}</Badge>
        </h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          All your cherished projects in one place.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {emptyArray.map((x, i) => (
          <ProjectLoading key={i} />
        ))}
      </div>
    </div>
  );
}
