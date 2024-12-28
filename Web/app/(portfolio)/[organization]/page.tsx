"use client";

import { organizationIdAtom } from "@/atoms/organization";
import { CreateProject } from "@/components/create-project";
import { OrganizationSettings } from "@/components/organization-settings";
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

import { useSetAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
  organization: string;
};

export default function OrganizationPage() {
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const { projects } = useProjects();
  const { organization: organizationParam } = useParams<Params>();
  const router = useRouter();

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
        setOrganization(org);
      } catch {
        setOrganizationId(null);
        router.push("/");
      }
    }

    validateOrganization();
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-4 px-4 md:px-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{organization?.slug}</p>
          <h1 className="text-3xl font-bold">{organization?.title}</h1>
        </div>
        <div>
          <OrganizationSettings />
        </div>
      </header>
      <section className="columns-sm items-start gap-4 space-y-4">
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
      </section>
    </main>
  );
}
