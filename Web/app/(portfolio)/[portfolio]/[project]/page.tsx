"use client";

import { projectIdAtom } from "@/atoms/project";
import { Project } from "@/interfaces/project.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECTS_COLLECTION_ID } from "@/lib/constants";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Usable, use, useEffect } from "react";

interface Params {
  portfolio: string;
  project: string;
}

interface Props {
  params: Usable<Params>;
}

export default function ProjectPage({ params }: Props) {
  const [projectId, setProjectId] = useAtom(projectIdAtom);
  const router = useRouter();
  const { project: projectParam } = use(params);

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
