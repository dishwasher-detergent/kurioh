"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useSession } from "@/hooks/userSession";
import { Project } from "@/interfaces/project.interface";
import { getUserById } from "@/lib/auth";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { getTeamById } from "@/lib/team";

interface Props {
  initialProject: Project;
}

export const useProject = ({ initialProject }: Props) => {
  const router = useRouter();
  const [project, setProject] = useState<Project>(initialProject);
  const [loading, setLoading] = useState<boolean>(true);

  const { client, loading: sessionLoading } = useSession();

  useEffect(() => {
    setLoading(sessionLoading);
  }, [sessionLoading]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (client) {
      unsubscribe = client.subscribe<Project>(
        `databases.${DATABASE_ID}.collections.${PROJECT_COLLECTION_ID}.documents.${project?.$id}`,
        async (response) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            const { data } = await getUserById(response.payload.userId);
            const { data: teamData } = await getTeamById(
              response.payload.teamId
            );

            setProject({
              user: data,
              team: teamData,
              ...response.payload,
            });
          }

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            router.push("/app");
          }
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [client]);

  return { project, loading };
};
