"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DyanmicDrawer } from "@/components/ui/dynamic-drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from "@/constants/project.constants";
import { createProject } from "@/lib/db";
import { AddProjectFormData, addProjectSchema } from "@/lib/db/schemas";
import { cn } from "@/lib/utils";

interface AddProjectProps {
  teamId: string;
  className?: string;
}

export function AddProject({ teamId, className }: AddProjectProps) {
  const [open, setOpen] = useState(false);

  return (
    <DyanmicDrawer
      title="Project"
      description="Create a new Project"
      open={open}
      setOpen={setOpen}
      button={
        <Button size="sm" className={className}>
          Add Project
          <LucidePlus className="ml-2 size-3.5" />
        </Button>
      }
    >
      <CreateForm setOpen={setOpen} teamId={teamId} />
    </DyanmicDrawer>
  );
}

interface FormProps extends React.ComponentProps<"form"> {
  setOpen: (e: boolean) => void;
  teamId: string;
}

function CreateForm({ className, setOpen, teamId }: FormProps) {
  const router = useRouter();

  const form = useForm<AddProjectFormData>({
    mode: "onChange",
    resolver: zodResolver(addProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      teamId: teamId,
    },
  });

  async function onSubmit(values: AddProjectFormData) {
    const data = await createProject({
      data: values,
    });

    if (data.success) {
      toast.success(data.message);
      router.push(`/app/teams/${teamId}/projects/${data.data?.$id}`);
      setOpen(false);
    } else {
      toast.error(data.message);
    }

    setOpen(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "flex h-full flex-col gap-4 overflow-hidden p-4 md:p-0",
          className,
        )}
      >
        <div className="flex-1 space-y-4 overflow-auto p-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Name your project."
                      className="truncate pr-20"
                      maxLength={NAME_MAX_LENGTH}
                    />
                    <Badge
                      className="absolute top-1/2 right-1.5 -translate-y-1/2"
                      variant="secondary"
                    >
                      {field?.value?.length || 0}/{NAME_MAX_LENGTH}
                    </Badge>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder="Describe your project."
                      className="pb-8"
                      maxLength={DESCRIPTION_MAX_LENGTH}
                    />
                    <Badge
                      className="absolute bottom-2 left-2"
                      variant="secondary"
                    >
                      {field?.value?.length || 0}/{DESCRIPTION_MAX_LENGTH}
                    </Badge>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="sticky bottom-0"
          type="submit"
          disabled={
            form.formState.isSubmitting ||
            !form.formState.isValid ||
            !form.formState.isDirty
          }
        >
          Create Project
          {form.formState.isSubmitting ? (
            <LucideLoader2 className="size-3.5 animate-spin" />
          ) : (
            <LucidePlus className="size-3.5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
