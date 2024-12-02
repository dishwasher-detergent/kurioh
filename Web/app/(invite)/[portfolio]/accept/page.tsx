"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { LucideLoader2 } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Invite() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const teamId = searchParams.get("teamId") as string;
  const membershipId = searchParams.get("membershipId") as string;
  const userId = searchParams.get("userId") as string;
  const secret = searchParams.get("secret") as string;

  async function acceptTeamInvite() {
    setLoading(true);

    try {
      const { team, account } = await createClient();
      await team.updateMembershipStatus(teamId, membershipId, userId, secret);

      const user = await getLoggedInUser();

      if (user?.passwordUpdate == "") {
        router.push("/password");
      } else {
        await account.deleteSessions();
        router.push(`/login`);
      }
    } catch (err) {
      const error = err as Error;
      setState(error.message);
    }

    setLoading(false);
  }

  return (
    <Card className="w-full max-w-sm bg-muted/25">
      <CardHeader>
        <CardTitle className="text-2xl">Accept Invite</CardTitle>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          acceptTeamInvite();
        }}
      >
        <CardContent className="grid gap-4">
          {state ? (
            <p className="w-full overflow-hidden rounded-xl border border-dashed border-destructive p-4 text-xs font-bold text-destructive">
              {state}
            </p>
          ) : null}
          <div className="grid gap-2">
            <Label>Portfolio</Label>
            <p className="font-bold">{teamId}</p>
          </div>
          <input name="teamId" value={teamId} readOnly className="hidden" />
          <input
            name="membershipId"
            value={membershipId}
            readOnly
            className="hidden"
          />
          <input name="userId" value={userId} readOnly className="hidden" />
          <input name="secret" value={secret} readOnly className="hidden" />
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading && (
              <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
            )}
            Accept Invite
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
