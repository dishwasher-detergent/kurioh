import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Header loading={true} />
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </>
  );
}
