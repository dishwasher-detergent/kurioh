import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AcceptForm } from "./form";

export default async function Invite({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Card className="bg-background w-full max-w-sm">
      <CardHeader>
        <CardTitle className="mt-2 text-2xl">Accept Team Invite</CardTitle>
      </CardHeader>
      <CardContent>
        <AcceptForm invitationId={id} />
      </CardContent>
    </Card>
  );
}
