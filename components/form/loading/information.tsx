import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingInput } from "@/components/ui/form/loading/input";
import { Separator } from "@/components/ui/separator";
import { LucideLoader2 } from "lucide-react";

export const InformationFormLoading = () => {
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoadingInput title="Title" />
        <LoadingInput title="Description" />
        <LoadingInput title="Icon" className="h-28" />
        <Separator />
        <p className="font-semibold leading-none tracking-tight">Socials</p>
        <LoadingInput title="GitHub" />
        <LoadingInput title="BitBucket" />
        <LoadingInput title="GitLab" />
        <LoadingInput title="CodePen" />
        <LoadingInput title="Twitter" />
        <LoadingInput title="LinkedIn" />
        <div className="flex flex-row gap-2">
          <Button disabled={true}>
            <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
            Save
          </Button>
          <Button disabled={true} type="button" variant="destructive">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
