"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";

export function SubNav() {
  const segments = useSelectedLayoutSegments();

  const subNav = useMemo<React.ReactNode>(() => {
    if (segments[5] === "projects") {
      return (
        <>
          <Button
            asChild
            variant={segments[7] === "api" ? "secondary" : "ghost"}
            size="sm"
          >
            <Link
              href={`/app/teams/${segments[3]}/projects/${segments[6]}/api`}
            >
              API
            </Link>
          </Button>
        </>
      );
    }

    if (segments[1] === "teams") {
      return (
        <>
          <Button
            asChild
            variant={!segments[4] ? "secondary" : "ghost"}
            size="sm"
          >
            <Link href={`/app/teams/${segments[3]}`}>Projects</Link>
          </Button>
          <Button
            asChild
            variant={segments[4] === "information" ? "secondary" : "ghost"}
            size="sm"
          >
            <Link href={`/app/teams/${segments[3]}/information`}>
              Information
            </Link>
          </Button>
          <Button
            asChild
            variant={segments[4] === "experience" ? "secondary" : "ghost"}
            size="sm"
          >
            <Link href={`/app/teams/${segments[3]}/experience`}>
              Experience
            </Link>
          </Button>
          <Button
            asChild
            variant={segments[4] === "api" ? "secondary" : "ghost"}
            size="sm"
          >
            <Link href={`/app/teams/${segments[3]}/api`}>API</Link>
          </Button>
          <Button
            asChild
            variant={segments[4] === "members" ? "secondary" : "ghost"}
            size="sm"
          >
            <Link href={`/app/teams/${segments[3]}/members`}>Members</Link>
          </Button>
        </>
      );
    }

    return null;
  }, [segments]);

  if (segments[0] != "(teams)") return null;

  return (
    <div className="dark:bg-muted/30 border-t">
      <ul className="mx-auto flex max-w-6xl flex-row items-center gap-2 overflow-x-auto px-4 py-1 md:px-8">
        {subNav}
      </ul>
    </div>
  );
}
