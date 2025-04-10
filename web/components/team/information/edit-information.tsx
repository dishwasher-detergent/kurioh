"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucideSave } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Information } from "@/interfaces/information.interface";
import { updateInformation } from "@/lib/db";
import {
  EditInformationFormData,
  editInformationSchema,
} from "@/lib/db/schemas";

interface InformationFormProps extends Information {
  orgId: string;
}

export default function InformationForm({
  $id,
  title,
  description,
  socials,
  image,
}: InformationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof editInformationSchema>>({
    resolver: zodResolver(editInformationSchema),
    defaultValues: {
      title: title ?? "",
      description: description ?? "",
      socials: socials.map((link) => ({ label: link, value: link })),
      image: image,
    },
  });

  async function onSubmit(values: EditInformationFormData) {
    setLoading(true);

    const data = await updateInformation({
      id: $id,
      data: values,
    });

    if (data.success) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message);
    }

    setLoading(false);
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
                    {field?.value?.length}/{INFORMATION_TITLE_MAX_LENGTH}
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
                    maxLength={INFORMATION_DESCRIPTION_MAX_LENGTH}
                  />
                  <Badge
                    className="absolute bottom-2 left-2"
                    variant="secondary"
                  >
                    {field?.value?.length}/{INFORMATION_DESCRIPTION_MAX_LENGTH}
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
          name="image"
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
                    <p className="text-center leading-4 text-gray-600 dark:text-gray-400">
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
        <Button type="submit" size="sm" disabled={loading}>
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
