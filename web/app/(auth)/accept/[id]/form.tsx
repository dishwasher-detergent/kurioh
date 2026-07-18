"use client";

import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/userSession";
import { authClient } from "@/lib/auth/client";

interface AcceptFormProps {
  invitationId: string;
}

export function AcceptForm({ invitationId }: AcceptFormProps) {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  async function acceptTeamInvite() {
    if (!user) {
      router.push(`/signin`);
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.organization.acceptInvitation({
        invitationId,
      });

      if (error) {
        throw new Error(error.message ?? "Failed to accept invite");
      }

      router.push("/app");
    } catch (err) {
      console.error(err);

      toast.error("Failed to accept invite");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        acceptTeamInvite();
      }}
    >
      <input
        name="invitationId"
        value={invitationId}
        readOnly
        className="hidden"
      />
      <Button
        className="w-full"
        type="submit"
        disabled={loading || sessionLoading}
      >
        {user ? "Accept Invite" : "Sign In to Accept"}
        {loading && <LucideLoader2 className="mr-2 size-3.5 animate-spin" />}
      </Button>
    </form>
  );
}
