"use client";

import { projectIdAtom } from "@/atoms/project";

import { useAtom } from "jotai";
import { useEffect } from "react";

interface SetProjectProps {
  $id?: string;
  title?: string;
}

export function SetProject({ title, $id }: SetProjectProps) {
  const [projectId, setProjectId] = useAtom(projectIdAtom);

  useEffect(() => {
    if (projectId?.id === $id && projectId?.title === title) return;

    if (!$id || !title) {
      setProjectId(null);
      return;
    }

    setProjectId({
      id: $id,
      title: title,
    });
  }, []);

  return null;
}
