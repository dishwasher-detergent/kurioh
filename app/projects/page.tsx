import { ProjectCard } from "@/components/ui/project/card";

export default function Projects() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold">Projects</h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ProjectCard
          title="Sample"
          description="Sample"
          badges={["Sample", "Sample"]}
          websites={["https://github.com/Sample", "https://kennethbass.com"]}
          images={[
            "https://images.unsplash.com/photo-1701505708176-63194ee8f0e8",
            "https://images.unsplash.com/photo-1701380477617-a871a4e69318",
          ]}
        />
        <ProjectCard
          title="Sample2"
          description="Sample"
          badges={["Sample", "Sample"]}
          websites={["https://github.com/Sample", "https://kennethbass.com"]}
          images={[
            "https://images.unsplash.com/photo-1701505708176-63194ee8f0e8",
            "https://images.unsplash.com/photo-1701380477617-a871a4e69318",
          ]}
        />
        <ProjectCard
          title="Sample3"
          description="Sample"
          badges={["Sample", "Sample"]}
          websites={["https://github.com/Sample", "https://kennethbass.com"]}
          images={[
            "https://images.unsplash.com/photo-1701505708176-63194ee8f0e8",
            "https://images.unsplash.com/photo-1701380477617-a871a4e69318",
          ]}
        />
        <ProjectCard
          title="Sample4"
          description="Sample"
          badges={["Sample", "Sample"]}
          websites={["https://github.com/Sample", "https://kennethbass.com"]}
          images={[
            "https://images.unsplash.com/photo-1701505708176-63194ee8f0e8",
            "https://images.unsplash.com/photo-1701380477617-a871a4e69318",
          ]}
        />
        <ProjectCard
          title="Sample5"
          description="Sample"
          badges={["Sample", "Sample"]}
          websites={["https://github.com/Sample", "https://kennethbass.com"]}
          images={[
            "https://images.unsplash.com/photo-1701505708176-63194ee8f0e8",
            "https://images.unsplash.com/photo-1701380477617-a871a4e69318",
          ]}
        />
      </div>
    </div>
  );
}
