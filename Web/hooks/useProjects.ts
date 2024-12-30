import { organizationIdAtom } from "@/atoms/organization";
import { Project as ProjectItem } from "@/interfaces/project.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECTS_COLLECTION_ID } from "@/lib/constants";

import { Client, Query } from "appwrite";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export const useProjects = () => {
  const organizationId = useAtomValue(organizationIdAtom);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    async function fetchProjects(organizationId: string) {
      setLoading(true);
      const { database } = await createClient();

      const data = await database.listDocuments<ProjectItem>(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        [
          Query.equal("organization_id", organizationId),
          Query.orderDesc("$createdAt"),
        ],
      );

      setProjects(data.documents);
      setLoading(false);
    }

    if (organizationId && projects.length === 0) {
      fetchProjects(organizationId.id);
    }
  }, [organizationId, projects.length]);

  useEffect(() => {
    async function fetchClient() {
      const { client } = await createClient();
      setClient(client);
    }

    fetchClient();
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (client) {
      unsubscribe = client.subscribe<ProjectItem>(
        `databases.${DATABASE_ID}.collections.${PROJECTS_COLLECTION_ID}.documents`,
        (response) => {
          if (response.payload.organization_id === organizationId?.id) {
            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.create",
              )
            ) {
              setProjects((prev) => [response.payload, ...prev]);
            }

            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.update",
              )
            ) {
              setProjects((prev) => {
                const index = prev.findIndex(
                  (x) => x.$id == response.payload.$id,
                );
                const newItem = response.payload;
                prev[index] = newItem;

                return prev;
              });
            }

            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.delete",
              )
            ) {
              setProjects((prev) =>
                prev.filter((x) => x.$id !== response.payload.$id),
              );
            }
          }
        },
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [client, organizationId]);

  return { projects, loading };
};
