"use client";

import { organizationIdAtom } from "@/atoms/organization";
import { projectIdAtom } from "@/atoms/project";

import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

interface SetOrganizationProps {
  title?: string;
  $id?: string;
}

export function SetOrganization({ title, $id }: SetOrganizationProps) {
  const [organizationId, setOrganizationId] = useAtom(organizationIdAtom);
  const setProjectId = useSetAtom(projectIdAtom);

  useEffect(() => {
    if (organizationId?.id === $id && organizationId?.title === title) return;

    if (!$id || !title) {
      setOrganizationId(null);
      setProjectId(null);
      return;
    }

    setOrganizationId({
      id: $id,
      title: title,
    });
  }, []);

  return null;
}
