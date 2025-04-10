"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";

export function SubNav() {
  const segments = useSelectedLayoutSegments();

  const subNav = useMemo<React.ReactNode>(() => {
    if (segments[3] === "project") {
      return (
        <>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/app/teams/${segments[2]}/project/${segments[4]}/api`}>
              API
            </Link>
          </Button>
        </>
      );
    }

    if (segments[1] === "teams") {
      return (
        <>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/app/teams/${segments[3]}`}>Projects</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/app/teams/${segments[3]}/information`}>
              Information
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/app/teams/${segments[3]}/experience`}>
              Experience
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/app/teams/${segments[3]}/api`}>API</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/app/teams/${segments[3]}/members`}>Members</Link>
          </Button>
        </>
      );

      return null;
    }

    return "";
  }, [segments]);

  if (segments[0] != "(teams)") return null;

  return (
    <div className="border-t bg-muted/50">
      <ul className="mx-auto flex max-w-6xl border-t flex-row items-center gap-2 px-4 py-1 md:px-8">
        {subNav}
      </ul>
    </div>
  );
}
