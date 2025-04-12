"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/hooks/userSession";
import { Project } from "@/interfaces/project.interface";
import { getUserById } from "@/lib/auth";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { getTeamById } from "@/lib/team";

interface Props {
  initialProjects?: Project[];
  teamId?: string;
  userId?: string;
}

export const useProjects = ({ initialProjects, teamId, userId }: Props) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects ?? []);
  const [loading, setLoading] = useState<boolean>(true);

  const { client, loading: sessionLoading } = useSession();

  useEffect(() => {
    setLoading(sessionLoading);
  }, [sessionLoading]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (client) {
      unsubscribe = client.subscribe<Project>(
        `databases.${DATABASE_ID}.collections.${PROJECT_COLLECTION_ID}.documents`,
        async (response) => {
          if (teamId && response.payload.teamId !== teamId) return;
          if (userId && response.payload.userId !== userId) return;

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create",
            )
          ) {
            const { data } = await getUserById(response.payload.userId);
            const { data: teamData } = await getTeamById(
              response.payload.teamId,
            );

            setProjects((prev) => [
              {
                ...response.payload,
                user: data,
                team: teamData,
              },
              ...prev,
            ]);
          }

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update",
            )
          ) {
            const { data } = await getUserById(response.payload.userId);
            const { data: teamData } = await getTeamById(
              response.payload.teamId,
            );

            setProjects((prev) =>
              prev.map((x) =>
                x.$id === response.payload.$id
                  ? { user: data, ...response.payload, team: teamData }
                  : x,
              ),
            );
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
        },
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [client]);

  return { projects, loading };
};
