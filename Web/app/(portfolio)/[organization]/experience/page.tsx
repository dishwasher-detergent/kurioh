"use client";

import { organizationIdAtom } from "@/atoms/organization";
import ExperienceForm from "@/components/forms/experience/form";
import ExperienceFormLoading from "@/components/forms/experience/loading";
import { OrganizationSettings } from "@/components/organization-settings";
import { Card, CardContent } from "@/components/ui/card";
import { Experience } from "@/interfaces/experience.interface";
import { Organization } from "@/interfaces/organization.interface";
import { createClient } from "@/lib/client/appwrite";
import {
  API_ENDPOINT,
  DATABASE_ID,
  EXPERIENCE_COLLECTION_ID,
  ORGANIZATION_COLLECTION_ID,
} from "@/lib/constants";
import { Query } from "appwrite";

import { useSetAtom } from "jotai";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
  organization: string;
};

export default function OrganizationExperience() {
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [experience, setExperience] = useState<Experience[]>([]);
  const { organization: organizationParam } = useParams<Params>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function validateOrganization() {
      setLoading(true);

      try {
        const { database } = await createClient();
        const org = await database.getDocument<Organization>(
          DATABASE_ID,
          ORGANIZATION_COLLECTION_ID,
          organizationParam,
        );

        if (!org) throw new Error("Missing organization.");

        const exp = await database.listDocuments<Experience>(
          DATABASE_ID,
          EXPERIENCE_COLLECTION_ID,
          [Query.equal("organization_id", organizationParam)],
        );

        setOrganizationId({
          title: org.title,
          id: org.$id,
        });
        setOrganization(org);
        setExperience(exp.documents);
        setLoading(false);
      } catch {
        setOrganizationId(null);
        router.push("/");
      }
    }

    validateOrganization();
  }, []);

  return (
    <main className="mx-auto min-h-full max-w-6xl p-4 px-4 md:px-8">
      {!loading && (
        <header className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {organization?.slug}
            </p>
            <h1 className="text-3xl font-bold">{organization?.title}</h1>
            <p className="text-sm">
              Endpoint:&nbsp;
              <Link
                href={`${API_ENDPOINT}/organizations/${organization?.$id}`}
                target="_blank"
              >
                {API_ENDPOINT}
                /organizations/{organization?.$id}
              </Link>
            </p>
          </div>
          <div>
            <OrganizationSettings />
          </div>
        </header>
      )}
      <Card>
        <CardContent className="p-4">
          {loading && <ExperienceFormLoading />}
          {experience && !loading && <ExperienceForm experience={experience} />}
        </CardContent>
      </Card>
    </main>
  );
}
