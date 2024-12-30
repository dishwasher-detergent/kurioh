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
import { Header } from "@/components/ui/header";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/useProjects";
import { Organization } from "@/interfaces/organization.interface";
import { createClient } from "@/lib/client/appwrite";
import {
  API_ENDPOINT,
  DATABASE_ID,
  ORGANIZATION_COLLECTION_ID,
} from "@/lib/constants";

import { useSetAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
  organization: string;
};

export default function OrganizationPage() {
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const { projects, loading } = useProjects();
  const { organization: organizationParam } = useParams<Params>();
  const router = useRouter();

  useEffect(() => {
    async function validateOrganization() {
      try {
        const { database } = await createClient();
        const org = await database.getDocument<Organization>(
          DATABASE_ID,
          ORGANIZATION_COLLECTION_ID,
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
    <main className="mx-auto min-h-full max-w-6xl p-4 px-4 md:px-8">
      <Header
        title={organization?.title}
        slug={organization?.slug}
        loading={loading}
        endpoint={`${API_ENDPOINT}/organizations/${organization?.$id}`}
      >
        <OrganizationSettings />
      </Header>
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
    </main>
  );
}
