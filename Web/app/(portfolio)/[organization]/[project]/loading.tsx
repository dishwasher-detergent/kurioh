import ProjectFormLoading from "@/components/forms/project/loading";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/ui/header";

export default function Loading() {
  return (
    <>
      <main className="mx-auto max-w-6xl space-y-4 p-4 px-4 md:px-8">
        <Header loading={true} />
        <Card>
          <CardContent className="p-4">
            <ProjectFormLoading />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
