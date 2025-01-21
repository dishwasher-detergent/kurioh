"use client";

import { organizationIdAtom } from "@/atoms/organization";
import { CreateOrg } from "@/components/create-organization";
import { Organization } from "@/interfaces/organization.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, ORGANIZATION_COLLECTION_ID } from "@/lib/constants";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";
import Loading from "./(portfolio)/[organization]/loading";

export default function Home() {
  const [organizationId, setorganizationId] = useAtom(organizationIdAtom);
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
          try {
            const org = await database.getDocument<Organization>(
              DATABASE_ID,
              ORGANIZATION_COLLECTION_ID,
              organizationId
            );
            
            router.push(org.$id);
            return;
          } catch (err) {
            console.error("Couldn't find organization");
          }
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
    <>
      {loading && <Loading />}
      {!loading && (
        <main className="mx-auto grid h-full min-h-dvh max-w-6xl place-items-center space-y-4 p-4 px-4 md:px-8">
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <h1 className="text-xl font-bold">
              Looks like you don&apos;t have any orgnaizations created yet.
            </h1>
            <p>Lets get started!</p>
            <div>
              <CreateOrg />
            </div>
          </div>
        </main>
      )}
    </>
  );
}
