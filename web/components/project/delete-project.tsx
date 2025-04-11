"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucideTrash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { DyanmicDrawer } from "@/components/ui/dynamic-drawer";
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
import { NAME_MAX_LENGTH } from "@/constants/project.constants";
import { Project } from "@/interfaces/project.interface";
import { deleteProject } from "@/lib/db";
import { DeleteProjectFormData, deleteProjectSchema } from "@/lib/db/schemas";
import { cn } from "@/lib/utils";

export function DeleteProject({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <DyanmicDrawer
      title={`Delete ${project.name}`}
      description="This is permanent and cannot be undone."
      open={open}
      setOpen={setOpen}
      button={
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <LucideTrash2 className="size-3.5" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      }
    >
      <DeleteForm setOpen={setOpen} project={project} />
    </DyanmicDrawer>
  );
}

interface FormProps extends React.ComponentProps<"form"> {
  setOpen: (e: boolean) => void;
  project: Project;
}

function DeleteForm({ className, setOpen, project }: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<DeleteProjectFormData>({
    resolver: zodResolver(deleteProjectSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: DeleteProjectFormData) {
    setLoading(true);

    if (values.name !== project.name) {
      form.setError("name", {
        message: "Name does not match.",
      });

      toast.error("Name does not match.");
      setLoading(false);
      return;
    }

    const data = await deleteProject(project.$id);

    if (data.success) {
      toast.success(data.message);
      router.refresh();
      setOpen(false);
    } else {
      toast.error(data.message);
    }

    setLoading(false);
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "h-full flex flex-col gap-4 overflow-hidden p-4 md:p-0",
          className
        )}
      >
        <div className="flex-1 space-y-4 overflow-auto p-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder={project.name}
                      className="truncate pr-20"
                      maxLength={NAME_MAX_LENGTH}
                    />
                    <Badge
                      className="absolute right-1.5 top-1/2 -translate-y-1/2"
                      variant="secondary"
                    >
                      {field?.value?.length}/{NAME_MAX_LENGTH}
                    </Badge>
                  </div>
                </FormControl>
                <FormDescription>
                  Enter the project name to confirm deletion.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          variant="destructive"
          disabled={
            loading || !form.formState.isValid || !form.formState.isDirty
          }
        >
          Delete Project
          {loading ? (
            <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
          ) : (
            <LucideTrash2 className="mr-2 size-3.5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
