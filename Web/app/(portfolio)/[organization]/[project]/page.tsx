"use client";

import { projectIdAtom } from "@/atoms/project";
import ProjectForm from "@/components/forms/project/form";
import ProjectFormLoading from "@/components/forms/project/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Project } from "@/interfaces/project.interface";
import { createClient } from "@/lib/client/appwrite";
import {
  API_ENDPOINT,
  DATABASE_ID,
  PROJECTS_COLLECTION_ID,
} from "@/lib/constants";

import { useSetAtom } from "jotai";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
  organization: string;
  project: string;
};

export default function ProjectPage() {
  const setProjectId = useSetAtom(projectIdAtom);
  const { project: projectParam } = useParams<Params>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function validateProject() {
      setLoading(true);
      try {
        const { database } = await createClient();
        const project = await database.getDocument<Project>(
          DATABASE_ID,
          PROJECTS_COLLECTION_ID,
          projectParam,
        );

        setProject(project);
        setProjectId({
          title: project.title,
          id: project.$id,
        });
        setLoading(false);
      } catch {
        setProjectId(null);
        router.push("/");
      }
    }

    validateProject();
  }, []);

  return (
    <>
      <main className="mx-auto max-w-6xl space-y-4 p-4 px-4 md:px-8">
        {!loading && (
          <header className="mb-8 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{project?.slug}</p>
              <h1 className="text-3xl font-bold">{project?.title}</h1>
              <p className="text-sm">
                Endpoint:
                <Link
                  href={`${API_ENDPOINT}/organizations/${project?.organization_id}/projects/${project?.$id}`}
                  target="_blank"
                >
                  {API_ENDPOINT}
                  /organizations/{project?.organization_id}/projects/
                  {project?.$id}
                </Link>
              </p>
            </div>
          </header>
        )}
        <Card>
          <CardHeader>
            <CardDescription className="text-xs">
              {project?.slug}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <ProjectFormLoading />}
            {project && <ProjectForm {...project} setProject={setProject} />}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
