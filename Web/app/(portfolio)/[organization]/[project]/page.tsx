"use client";

import { projectIdAtom } from "@/atoms/project";
import ProjectForm from "@/components/forms/project/form";
import { Project } from "@/interfaces/project.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECTS_COLLECTION_ID } from "@/lib/constants";

import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
  organization: string;
  project: string;
};

export default function ProjectPage() {
  const setProjectId = useSetAtom(projectIdAtom);
  const { project: projectParam } = useParams<Params>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    async function validateProject() {
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
      } catch {
        setProjectId(null);
      }
    }

    validateProject();
  }, []);

  return (
    <>
      <main className="mx-auto max-w-4xl space-y-4 p-4 px-4 md:px-8">
        {/* <Card>
          <CardHeader>
            <CardDescription>{project?.slug}</CardDescription>
            <CardTitle>{project?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project?.description}</p>
            <p>{project?.short_description}</p>
            <p>{project?.tags}</p>
            <p>{project?.links}</p>
            <p>{project?.images_ids}</p>
          </CardContent>
        </Card> */}
        <ProjectForm />
      </main>
    </>
  );
}
