"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";
import { LucideLoader2, LucideSave } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { organizationIdAtom } from "@/atoms/organization";
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
import { Information } from "@/interfaces/information.interface";
import { deleteFile, updateInformation, uploadFile } from "@/lib/utils";
import informationSchema, {
  descriptionMaxLength,
  titleMaxLength,
} from "./schema";

interface InformationFormProps extends Information {
  setInformation: (organization: Information) => void;
}

export default function InformationForm({
  setInformation,
  $id,
  title,
  description,
  socials,
  image_id,
}: InformationFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const organizationId = useAtomValue(organizationIdAtom);

  const form = useForm<z.infer<typeof informationSchema>>({
    resolver: zodResolver(informationSchema),
    defaultValues: {
      title: title ?? "",
      description: description ?? "",
      socials: socials.map((link) => ({ label: link, value: link })),
      image_id: image_id,
    },
  });

  async function onSubmit(values: z.infer<typeof informationSchema>) {
    setLoading(true);

    const uploadedImage = await handleFile(values.image_id);

    const formData = {
      ...values,
      socials: values?.socials?.map((link) => link.value) ?? [],
      image_id: uploadedImage?.$id ?? "",
    };

    const updatedInformation = await updateInformation($id, formData);

    if (updatedInformation) {
      setInformation(updatedInformation);
    }

    setLoading(false);
  }

  async function handleFile(image: any | undefined) {
    if (!organizationId) {
      return;
    }

    let data = undefined;

    if (image instanceof File) {
      data = await uploadFile(image, organizationId.id);
    }

    if (image_id != image && image_id != null && image_id != "") {
      await deleteFile(image_id);
    }

    return data;
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
                    maxLength={titleMaxLength}
                  />
                  <Badge
                    className="absolute right-1.5 top-1/2 -translate-y-1/2"
                    variant="secondary"
                  >
                    {field?.value?.length}/{titleMaxLength}
                  </Badge>
                </div>
              </FormControl>
              <FormDescription>Title your portfolio.</FormDescription>
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
                    maxLength={descriptionMaxLength}
                  />
                  <Badge
                    className="absolute bottom-2 left-2"
                    variant="secondary"
                  >
                    {field?.value?.length}/{descriptionMaxLength}
                  </Badge>
                </div>
              </FormControl>
              <FormDescription>Describe your portfolio here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <PhotoSelector {...field} />
              </FormControl>
              <FormDescription>
                Make your portfolio stand out with a striking image.
              </FormDescription>
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
                  emptyIndicator={
                    <p className="text-center leading-10 text-gray-600 dark:text-gray-400">
                      No results found.
                    </p>
                  }
                />
              </FormControl>
              <FormDescription>
                Add social media links to your portfolio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
          ) : (
            <LucideSave className="mr-2 size-3.5" />
          )}
          Save
        </Button>
      </form>
    </Form>
  );
}
