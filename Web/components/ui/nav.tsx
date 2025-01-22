"use client";

import { organizationIdAtom } from "@/atoms/organization";
import { projectIdAtom } from "@/atoms/project";
import { Organization } from "@/components/organization";
import { Project } from "@/components/project";
import { Button } from "@/components/ui/button";

import { useAtomValue } from "jotai";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";

export function Nav() {
  const segments = useSelectedLayoutSegments();
  const organizationId = useAtomValue(organizationIdAtom);
  const projectId = useAtomValue(projectIdAtom);

  const subNav = useMemo<React.ReactNode>(() => {
    if (segments[2] === "project") {
      return null;
    }

    if (segments[0] === "organization") {
      return (
        <>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/organization/${organizationId?.id}/information`}>
              Information
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/organization/${organizationId?.id}/experience`}>
              Experience
            </Link>
          </Button>
        </>
      );

      return null;
    }

    return "";
  }, [segments, organizationId, projectId]);

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-row items-center gap-2 p-4 md:px-8">
        <Organization />
        {organizationId && <>/</>}
        <Project />
      </div>
      {subNav && (
        <div className="border-t bg-muted/40">
          <div className="mx-auto flex max-w-6xl flex-row items-center gap-2 px-4 py-2 md:px-8">
            {subNav}
          </div>
        </div>
      )}
    </header>
  );
}
