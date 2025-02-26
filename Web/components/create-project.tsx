"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createProject, getProjects } from "@/lib/server/utils";
import { cn } from "@/lib/utils";
import { DyanmicDrawer } from "@/components/ui/dynamic-drawer";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucidePlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function CreateProject() {
  const [open, setOpen] = useState(false);

  return (
    <DyanmicDrawer
      title="Create Project"
      description="Create a new project in your organization."
      open={open}
      setOpen={setOpen}
      button={
        <Button className="w-full" variant="outline" size="sm">
          Create Project
          <LucidePlus className="ml-2 size-3.5 flex-none" />
        </Button>
      }
    >
      <div className="px-4">
        <CreateForm setOpen={setOpen} />
      </div>
    </DyanmicDrawer>
  );
}

interface FormProps extends React.ComponentProps<"form"> {
  setOpen: (e: boolean) => void;
}

const titleMaxLength = 64;

const schema = z.object({
  title: z.string().min(1).max(titleMaxLength),
});

function CreateForm({ className, setOpen }: FormProps) {
  const [loadingCreateProject, setLoadingCreateProject] =
    useState<boolean>(false);
  const router = useRouter();
  const { organization, project } = useParams<{
    organization: string;
    project: string;
  }>();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setLoadingCreateProject(true);

    const data = await createProject(values.title, organization);

    if (!data.success) {
      toast.error(data.message);
    }

    if (data.data) {
      const projects = await getProjects(organization);

      if (!projects.success) {
        toast.error(projects.message);
        router.push(`/organization/${organization}`);
      }

      if (projects?.data) {
        router.push(`/organization/${organization}/project/${data.data.$id}`);
      }
    }

    setLoadingCreateProject(false);
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-4", className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Sample Project"
                    className="truncate pr-20"
                    maxLength={titleMaxLength}
                  />
                  <Badge
                    className="absolute top-1/2 right-1.5 -translate-y-1/2"
                    variant="secondary"
                  >
                    {field?.value?.length}/{titleMaxLength}
                  </Badge>
                </div>
              </FormControl>
              <FormDescription>Name your project.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loadingCreateProject}>
          {loadingCreateProject ? (
            <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
          ) : (
            <LucidePlus className="mr-2 size-3.5" />
          )}
          Create
        </Button>
      </form>
    </Form>
  );
}
