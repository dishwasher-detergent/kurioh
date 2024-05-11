import { Header } from "@/components/ui/header";
import { ProjectLoading } from "@/components/ui/project/loading";

export default async function ProjectsLoading() {
  const randomLength = Math.floor(Math.random() * 25);
  const emptyArray = Array.from({ length: randomLength });

  return (
    <Header
      title="Projects"
      description="All your cherished projects in one place."
    >
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {emptyArray.map((x, i) => (
          <ProjectLoading key={i} />
        ))}
      </section>
    </Header>
  );
}
