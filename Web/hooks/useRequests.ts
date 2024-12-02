import { portfolioIdAtom } from "@/atoms/portfolio";
import { Request as RequestItem } from "@/interfaces/request.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, REQUEST_COLLECTION_ID } from "@/lib/constants";

import { Client, Query } from "appwrite";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export const useRequests = () => {
  const portfolioId = useAtomValue(portfolioIdAtom);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    async function fetchRequests(portfolioId: string) {
      setLoading(true);
      const { database } = await createClient();

      const data = await database.listDocuments<RequestItem>(
        DATABASE_ID,
        REQUEST_COLLECTION_ID,
        [
          Query.equal("portfolioId", portfolioId),
          Query.orderDesc("$createdAt"),
        ],
      );

      setRequests(data.documents);
      setLoading(false);
    }

    if (portfolioId && requests.length === 0) {
      fetchRequests(portfolioId);
    }
  }, [portfolioId, requests.length]);

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
      unsubscribe = client.subscribe<RequestItem>(
        `databases.${DATABASE_ID}.collections.${REQUEST_COLLECTION_ID}.documents`,
        (response) => {
          if (response.payload.portfolioId === portfolioId) {
            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.create",
              )
            ) {
              setRequests((prev) => [response.payload, ...prev]);
            }

            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.delete",
              )
            ) {
              setRequests((prev) =>
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
  }, [client, portfolioId]);

  return { requests, loading };
};
