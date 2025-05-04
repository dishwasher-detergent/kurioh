"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucideSave } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import MultipleSelector from "@/components/ui/multiple-selector";
import { PhotoSelector } from "@/components/ui/photo-selector";
import {
  INFORMATION_DESCRIPTION_MAX_LENGTH,
  INFORMATION_TITLE_MAX_LENGTH,
} from "@/constants/information.constants";
import { TeamData } from "@/interfaces/team.interface";
import { updateInformation } from "@/lib/db";
import {
  EditInformationFormData,
  editInformationSchema,
} from "@/lib/db/schemas";

interface InformationFormProps {
  information: TeamData;
  teamId: string;
}

export default function InformationForm({
  information,
  teamId,
}: InformationFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof editInformationSchema>>({
    mode: "onChange",
    resolver: zodResolver(editInformationSchema),
    defaultValues: {
      title: information?.title ?? "",
      description: information?.description ?? "",
      socials:
        information?.socials.map((link) => ({
          label: link,
          value: link,
        })) ?? [],
      favicon: information?.favicon,
      image: information?.image,
      skills:
        information.skills?.map((skill) => ({ label: skill, value: skill })) ??
        [],
    },
  });

  async function onSubmit(values: EditInformationFormData) {
    toast.promise(
      updateInformation({
        id: information.$id,
        data: values,
        teamId,
      }),
      {
        loading: "Saving information...",
        success: (data) => {
          if (data.success) {
            router.refresh();
          } else {
            throw new Error(data.message);
          }

          return data.message;
        },
        error: (error) => error.message,
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="My Portfolio"
                    className="truncate pr-20"
                    maxLength={INFORMATION_TITLE_MAX_LENGTH}
                  />
                  <Badge
                    className="absolute top-1/2 right-1.5 -translate-y-1/2"
                    variant="secondary"
                  >
                    {field?.value?.length || 0}/{INFORMATION_TITLE_MAX_LENGTH}
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
                    maxLength={INFORMATION_DESCRIPTION_MAX_LENGTH}
                  />
                  <Badge
                    className="absolute bottom-2 left-2"
                    variant="secondary"
                  >
                    {field?.value?.length || 0}/
                    {INFORMATION_DESCRIPTION_MAX_LENGTH}
                  </Badge>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <PhotoSelector {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="favicon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favicon</FormLabel>
              <FormControl>
                <PhotoSelector {...field} />
              </FormControl>
              <FormDescription>Recommended Size: 32x32</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="socials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Socials</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  creatable
                  placeholder="Add social links"
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
          name={`skills`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  creatable
                  placeholder="Add relevant skills (e.g., React, Project Management, Leadership)"
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
        <Button
          type="submit"
          disabled={
            form.formState.isSubmitting ||
            !form.formState.isValid ||
            !form.formState.isDirty
          }
        >
          {form.formState.isSubmitting ? (
            <LucideLoader2 className="size-3.5 animate-spin" />
          ) : (
            <LucideSave className="size-3.5" />
          )}
          Save Information
        </Button>
      </form>
    </Form>
  );
}
