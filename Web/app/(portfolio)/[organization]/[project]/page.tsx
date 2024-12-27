"use client";

import { projectIdAtom } from "@/atoms/project";
import { Project } from "@/interfaces/project.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECTS_COLLECTION_ID } from "@/lib/constants";

import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type Params = {
  organization: string;
  project: string;
};

export default function ProjectPage() {
  const [projectId, setProjectId] = useAtom(projectIdAtom);
  const router = useRouter();
  const { project: projectParam } = useParams<Params>();

  useEffect(() => {
    async function validateProject() {
      try {
        const { database } = await createClient();
        const project = await database.getDocument<Project>(
          DATABASE_ID,
          PROJECTS_COLLECTION_ID,
          projectParam,
        );

        setProjectId({
          title: project.title,
          id: project.$id,
        });
      } catch {
        setProjectId(null);
        router.push("not-found");
      }
    }

    if (projectParam != projectId?.id) {
      validateProject();
    }
  }, []);

  return (
    <>
      <main className="mx-auto max-w-4xl space-y-4 p-4 px-4 md:px-8">
        Project Main Page
      </main>
    </>
  );
}
