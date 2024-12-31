"use client";

import { organizationIdAtom } from "@/atoms/organization";

import { useSetAtom } from "jotai";
import { useEffect } from "react";

interface SetOrganizationProps {
  title?: string;
  $id?: string;
}

export function SetOrganization({ title, $id }: SetOrganizationProps) {
  const setOrganizationId = useSetAtom(organizationIdAtom);

  useEffect(() => {
    if (!$id || !title) {
      setOrganizationId(null);
      return;
    }

    setOrganizationId({
      id: $id,
      title: title,
    });
  }, []);

  return null;
}
