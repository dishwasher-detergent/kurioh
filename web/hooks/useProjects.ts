"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { DocumentList } from "@/interfaces/result.interface";
import { Project } from "@/interfaces/project.interface";
import { listProjectsByTeam } from "@/lib/db/project";

interface Props {
  initialProjects?: DocumentList<Project>;
  teamId?: string;
  userId?: string;
  searchTerm?: string;
  limit?: number;
  cursor?: string;
}

export const useProjects = ({
  initialProjects,
  teamId,
  searchTerm,
  limit = 5,
  cursor,
}: Props) => {
  const [projects, setProjects] = useState<Project[]>(
    initialProjects?.documents ?? [],
  );
  const [loading, setLoading] = useState<boolean>(
    initialProjects ? false : true,
  );
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalProjects, setTotalProjects] = useState<number>(
    initialProjects?.total ?? 0,
  );
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [initialLoad, setInitialLoad] = useState<boolean>(
    !!initialProjects && !cursor && !searchTerm,
  );

  useEffect(() => {
    if (initialLoad) {
      if (initialProjects && initialProjects.documents.length > 0) {
        const lastDocument =
          initialProjects.documents[initialProjects.documents.length - 1];
        setNextCursor(lastDocument?.$id);
        setHasMore(initialProjects.documents.length === limit);
      }
      return;
    }

    const fetchProjects = async () => {
      if (!teamId) return;

      setLoading(true);

      try {
        const result = await listProjectsByTeam(teamId, {
          search: searchTerm,
          limit,
          cursorId: cursor,
        });

        if (result.success && result.data) {
          if (cursor) {
            setProjects((prev) => [...prev, ...(result.data?.documents || [])]);
          } else {
            setProjects(result.data.documents);
          }

          setTotalProjects(result.data.total);

          const lastDocument =
            result.data.documents[result.data.documents.length - 1];
          setNextCursor(lastDocument?.$id);

          setHasMore(result.data.documents.length === limit);
        } else {
          toast.error(result.message);
          if (!cursor) {
            setProjects([]);
          }
          setHasMore(false);
          setNextCursor(undefined);
        }
      } catch {
        if (!cursor) {
          setProjects([]);
        }
        setHasMore(false);
        setNextCursor(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, searchTerm, limit, cursor, initialLoad]);

  useEffect(() => {
    if (searchTerm || cursor) {
      setInitialLoad(false);
    }
  }, [searchTerm, cursor]);

  return { projects, loading, hasMore, totalProjects, nextCursor };
};
