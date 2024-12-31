"use client";

import { projectIdAtom } from "@/atoms/project";

import { useSetAtom } from "jotai";
import { useEffect } from "react";

interface SetProjectProps {
  $id?: string;
  title?: string;
}

export function SetProject({ title, $id }: SetProjectProps) {
  const setProjectId = useSetAtom(projectIdAtom);

  useEffect(() => {
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
