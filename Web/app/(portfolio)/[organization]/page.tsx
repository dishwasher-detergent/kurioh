"use client";

import { organizationIdAtom } from "@/atoms/organization";
import { CreateProject } from "@/components/create-project";
import ProjectCard from "@/components/project-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProjects } from "@/hooks/useProjects";
import { Organization } from "@/interfaces/organization.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PORTFOLIOS_COLLECTION_ID } from "@/lib/constants";

import { useAtom } from "jotai";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";

type Params = {
  organization: string;
};

export default function OrganizationPage() {
  const [organizationId, setOrganizationId] = useAtom(organizationIdAtom);
  const { projects } = useProjects();
  const { organization: organizationParam } = useParams<Params>();

  useEffect(() => {
    async function validateOrganization() {
      try {
        const { database } = await createClient();
        const org = await database.getDocument<Organization>(
          DATABASE_ID,
          PORTFOLIOS_COLLECTION_ID,
          organizationParam,
        );

        setOrganizationId({
          title: org.title,
          id: org.$id,
        });
      } catch {
        setOrganizationId(null);
        notFound();
      }
    }

    if (organizationParam != organizationId?.id) {
      validateOrganization();
    }
  }, []);

  return (
    <main className="mx-auto max-w-4xl columns-sm items-start gap-4 space-y-4 p-4 px-4 md:px-8">
      {projects.map((x) => (
        <ProjectCard key={x.$id} {...x} />
      ))}
      {projects.length === 0 && (
        <Card className="overflow-hidden transition-all hover:border-primary hover:ring hover:ring-primary/10">
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
    </main>
  );
}
