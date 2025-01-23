import ExperienceFormLoading from "@/components/forms/experience/loading";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/ui/header";

export default function Loading() {
  return (
    <>
      <Header loading={true} />
      <Card>
        <CardContent className="p-4">
          <ExperienceFormLoading />
        </CardContent>
      </Card>
    </>
  );
}
