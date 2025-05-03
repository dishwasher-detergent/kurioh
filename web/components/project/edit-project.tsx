"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  LucideLoader2,
  LucidePartyPopper,
  LucideSave,
  LucideUndo2,
} from "lucide-react";
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
  const [initialImages, setInitialImages] = useState<string[] | undefined>(
    project.images,
  );

  const form = useForm<EditProjectFormData>({
    mode: "onChange",
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project.name ?? "",
      description: project.description ?? undefined,
      short_description: project.short_description ?? undefined,
      tags: project.tags?.map((tag) => ({ label: tag, value: tag })),
      links: project.links?.map((link) => ({ label: link, value: link })),
      images: project.images,
      ordinal: Number(project.ordinal),
      published: project.published ?? false,
    },
  });

  async function onSubmit(values: EditProjectFormData) {
    setInitialImages(project.images ?? initialImages);

    toast.promise(
      updateProject({
        id: project.$id,
        data: values,
        teamId,
      }),
      {
        loading: "Updating project...",
        success: (data) => {
          if (data.success) {
            router.refresh();
          } else {
            throw new Error(data.message);
          }

          return data.message;
        },
        error: (err) => {
          return err.message;
        },
      },
    );
  }

  async function handleSave(published: boolean) {
    form.setValue("published", published);
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
                    {field?.value?.length || 0}/{DESCRIPTION_MAX_LENGTH}
                  </Badge>
                </div>
              </FormControl>
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
                    {field?.value?.length || 0}/{SHORT_DESCRIPTION_MAX_LENGTH}
                  </Badge>
                </div>
              </FormControl>
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
                    (item): item is string | File => item !== null,
                  )}
                />
              </FormControl>
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
                  placeholder="Add tags to your project"
                  emptyIndicator={
                    <p className="text-muted-foreground text-center text-sm leading-4 font-semibold">
                      No results found.
                    </p>
                  }
                />
              </FormControl>
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
                  placeholder="Add project links"
                  emptyIndicator={
                    <p className="text-muted-foreground text-center text-sm leading-4 font-semibold">
                      No results found.
                    </p>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ordinal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordinal</FormLabel>
              <FormControl>
                <Input {...field} type="phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {project.published && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              onClick={() => handleSave(true)}
            >
              Save Project
              {form.formState.isSubmitting ? (
                <LucideLoader2 className="size-3.5 animate-spin" />
              ) : (
                <LucideSave className="size-3.5" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              onClick={() => handleSave(false)}
            >
              Unpublish
              {form.formState.isSubmitting ? (
                <LucideLoader2 className="size-3.5 animate-spin" />
              ) : (
                <LucideUndo2 className="size-3.5" />
              )}
            </Button>
          </div>
        )}
        {!project.published && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              onClick={() => handleSave(true)}
            >
              Save & Publish
              {form.formState.isSubmitting ? (
                <LucideLoader2 className="size-3.5 animate-spin" />
              ) : (
                <LucidePartyPopper className="size-3.5" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              onClick={() => handleSave(false)}
            >
              Save Draft
              {form.formState.isSubmitting ? (
                <LucideLoader2 className="size-3.5 animate-spin" />
              ) : (
                <LucideSave className="size-3.5" />
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
