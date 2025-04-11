"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucideSave } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AutosizeTextarea } from "@/components/ui/auto-size-textarea";
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
import { MultiplePhotoSelector } from "@/components/ui/multi-photo-selector";
import MultipleSelector from "@/components/ui/multiple-selector";
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SHORT_DESCRIPTION_MAX_LENGTH,
} from "@/constants/project.constants";
import { Project } from "@/interfaces/project.interface";
import { updateProject } from "@/lib/db";
import { EditProjectFormData, editProjectSchema } from "@/lib/db/schemas";
import { TAGS } from "./project-options";

interface ProjectFormProps {
  project: Project;
  teamId: string;
}

export default function EditProject({ project, teamId }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialImages, setInitialImages] = useState<string[] | undefined>(
    project.images
  );

  const form = useForm<EditProjectFormData>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project.name ?? "",
      description: project.description ?? undefined,
      short_description: project.short_description ?? undefined,
      tags: project.tags?.map((tag) => ({ label: tag, value: tag })),
      links: project.links?.map((link) => ({ label: link, value: link })),
      images: project.images,
    },
  });

  async function onSubmit(values: EditProjectFormData) {
    setLoading(true);
    setInitialImages(project.images ?? initialImages);

    const updatedProject = await updateProject({
      id: project.$id,
      data: values,
      teamId,
    });

    if (!updatedProject?.success) {
      toast.error(updatedProject.message);
      setLoading(false);

      return;
    }

    toast.success("Project updated successfully.");
    router.refresh();
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder="Sample Project"
                    className="truncate pr-20"
                    maxLength={NAME_MAX_LENGTH}
                  />
                  <Badge
                    className="absolute top-1/2 right-1.5 -translate-y-1/2"
                    variant="secondary"
                  >
                    {field?.value?.length ?? 0}/{NAME_MAX_LENGTH}
                  </Badge>
                </div>
              </FormControl>
              <FormDescription>Name your project.</FormDescription>
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
                  <AutosizeTextarea
                    {...field}
                    placeholder="This is a full length description."
                    className="pb-8"
                    maxLength={DESCRIPTION_MAX_LENGTH}
                  />
                  <Badge
                    className="absolute bottom-2 left-2"
                    variant="secondary"
                  >
                    {field?.value?.length ?? 0}/{DESCRIPTION_MAX_LENGTH}
                  </Badge>
                </div>
              </FormControl>
              <FormDescription>Describe your project here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="short_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <div className="relative">
                  <AutosizeTextarea
                    {...field}
                    placeholder="This is a short description."
                    className="pb-8"
                    maxLength={SHORT_DESCRIPTION_MAX_LENGTH}
                  />
                  <Badge
                    className="absolute bottom-2 left-2"
                    variant="secondary"
                  >
                    {field?.value?.length ?? 0}/{SHORT_DESCRIPTION_MAX_LENGTH}
                  </Badge>
                </div>
              </FormControl>
              <FormDescription>
                Give your projects elevator pitch here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <MultiplePhotoSelector
                  {...field}
                  value={field.value?.filter(
                    (item): item is string | File => item !== null
                  )}
                />
              </FormControl>
              <FormDescription>
                Let people, at a glance, know how you&apos;ve built your
                project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  defaultOptions={TAGS}
                  creatable
                  emptyIndicator={
                    <p className="text-center leading-4 text-gray-600 dark:text-gray-400">
                      No results found.
                    </p>
                  }
                />
              </FormControl>
              <FormDescription>
                Let people, at a glance, know how you&apos;ve built your
                project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="links"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Links</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  creatable
                  emptyIndicator={
                    <p className="text-center leading-4 text-gray-600 dark:text-gray-400">
                      No results found.
                    </p>
                  }
                />
              </FormControl>
              <FormDescription>
                Add links to your projects site, repo, or anything else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size="sm"
          type="submit"
          disabled={
            loading || !form.formState.isValid || !form.formState.isDirty
          }
        >
          Save Project
          {loading ? (
            <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
          ) : (
            <LucideSave className="mr-2 size-3.5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
