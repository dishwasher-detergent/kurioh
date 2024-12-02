"use client";

import { organizationIdAtom } from "@/atoms/organization";
import { Organization } from "@/interfaces/organization.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PORTFOLIOS_COLLECTION_ID } from "@/lib/constants";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Usable, use, useEffect } from "react";

interface Params {
  organization: string;
}

interface Props {
  params: Usable<Params>;
}

export default function OrganizationPage({ params }: Props) {
  const [organizationId, setOrganizationId] = useAtom(organizationIdAtom);
  const router = useRouter();
  const { organization: organizationParam } = use(params);

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
        router.push("not-found");
      }
    }

    if (organizationParam != organizationId?.id) {
      validateOrganization();
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
