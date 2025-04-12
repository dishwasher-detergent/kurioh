"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamData } from "@/interfaces/team.interface";

export function TeamCard(team: TeamData) {
  return (
    <Card className="break-inside-avoid-column gap-0 overflow-hidden rounded-xl py-0">
      <CardContent className="relative p-0">
        <CardHeader className="from-primary to-primary/20 flex h-full w-full flex-col justify-end bg-linear-to-t p-4">
          <CardTitle className="text-primary-foreground">
            <Button
              className="text-primary-foreground truncate p-0! text-xl"
              variant="link"
              asChild
            >
              <Link href={`/app/teams/${team.$id}`}>{team.name}</Link>
            </Button>
          </CardTitle>
          <CardDescription className="text-primary-foreground line-clamp-3">
            {team?.description ?? "No description provided."}
          </CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  );
}
