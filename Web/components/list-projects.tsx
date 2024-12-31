"use client";

import { CreateProject } from "@/components/create-project";
import ProjectCard from "@/components/project-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/useProjects";

export function ListProjects() {
  const { projects, loading } = useProjects();

  return (
    <section className="min-h-full columns-xs items-start gap-4 space-y-4">
      {loading &&
        [...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            className="h-48 w-full break-inside-avoid-column"
          />
        ))}
      {!loading && projects.length > 0 && (
        <Card className="break-inside-avoid-column overflow-hidden transition-all hover:border-primary hover:ring hover:ring-primary/10">
          <CardHeader>
            <CardDescription className="text-xs">Ooh Aah!</CardDescription>
            <CardTitle className="text-xl">Made something new?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full">
              <CreateProject />
            </div>
          </CardContent>
        </Card>
      )}
      {!loading && projects.map((x) => <ProjectCard key={x.$id} {...x} />)}
      {!loading && projects.length === 0 && (
        <Card className="break-inside-avoid-column overflow-hidden transition-all hover:border-primary hover:ring hover:ring-primary/10">
          <CardHeader>
            <CardDescription className="text-xs">Uh oh!</CardDescription>
            <CardTitle className="text-xl">No Projects Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full">
              <CreateProject />
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
