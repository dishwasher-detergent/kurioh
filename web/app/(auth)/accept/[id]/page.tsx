import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AcceptForm } from "./form";

export default async function Invite({
  searchParams,
}: {
  searchParams: Promise<{
    teamId: string;
    membershipId: string;
    userId: string;
    secret: string;
  }>;
}) {
  const { teamId, membershipId, userId, secret } = await searchParams;

  return (
    <Card className="bg-background w-full max-w-sm">
      <CardHeader>
        <CardTitle className="mt-2 text-2xl">Accept Team Invite</CardTitle>
      </CardHeader>
      <CardContent>
        <AcceptForm
          teamId={teamId}
          membershipId={membershipId}
          userId={userId}
          secret={secret}
        />
      </CardContent>
    </Card>
  );
}
