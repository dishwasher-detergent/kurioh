"use client";

import { organizationIdAtom } from "@/atoms/organization";
import { CreateOrg } from "@/components/create-organization";
import { Organization } from "@/interfaces/organization.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, ORGANIZATION_COLLECTION_ID } from "@/lib/constants";

import { useAtom } from "jotai";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

export default function Home() {
  const [organizationId, setorganizationId] = useAtom(organizationIdAtom);
  const [loadingCreateOrganization, setLoadingCreateOrganization] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function getOrganizations() {
      setLoading(true);
      const { database } = await createClient();
      const user = await getLoggedInUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (organizationId) {
        router.push(organizationId.id);
        return;
      }

      const data = await database.listDocuments<Organization>(
        DATABASE_ID,
        ORGANIZATION_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(1)],
      );

      if (data.documents.length > 0) {
        setorganizationId({
          title: data.documents[0].title,
          id: data.documents[0].$id,
        });
        router.replace(data.documents[0].$id);
      }

      setLoading(false);
    }

    getOrganizations();
  }, [organizationId]);

  return (
    <main className="grid min-h-dvh w-full place-items-center">
      {loading && (
        <p className="flex flex-row items-center gap-2">
          <LucideLoader2 className="size-4 animate-spin" />
          Checking for existing organizations
        </p>
      )}
      {!loading && (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">
            Looks like you don&apos;t have any orgnaizations created yet.
          </h1>
          <p>Lets get started!</p>
          <div>
            <CreateOrg />
          </div>
        </div>
      )}
    </main>
  );
}
