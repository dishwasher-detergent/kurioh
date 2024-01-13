import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingInput } from "@/components/ui/form/loading/input";
import { LucideLoader2 } from "lucide-react";

export const ProjectFormLoading = ({ title }: { title: string }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoadingInput title="Title" />
        <LoadingInput title="Short Description" className="h-16" />
        <LoadingInput title="Description" className="h-16" />
        <LoadingInput title="Images" className="h-28" />
        <LoadingInput title="Position" />
        <LoadingInput title="Tags" className="h-28" />
        <LoadingInput title="Links" className="h-28" />
        <LoadingInput title="Color" />
      </CardContent>
      <CardFooter className="flex w-full flex-row justify-end gap-2">
        <Button disabled={true} type="button" variant="destructive">
          Reset
        </Button>
        <Button disabled={true}>
          <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};
