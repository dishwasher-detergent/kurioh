"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrayInput } from "@/components/ui/form/array";
import { ImageArrayInput } from "@/components/ui/form/image_array";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Projects } from "@/interfaces/projects";
import {
  PROJECTS_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
  database_service,
  storage_service,
} from "@/lib/appwrite";
import { createSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1).max(128),
  short_description: z.string().min(1).max(128),
  description: z.string().min(1).max(1024),
  images: z.array(
    z.object({
      value: z.any(),
    }),
  ),
  position: z.coerce.number().min(1),
  tags: z.optional(
    z.array(
      z.object({
        value: z
          .string()
          .max(128, { message: "Tag must be less than 128 characters." }),
      }),
    ),
  ),
  links: z.optional(
    z.array(
      z.object({
        value: z.string(),
      }),
    ),
  ),
  color: z.string().min(1).max(128),
});

interface CreateProjectFormProps {
  title?: string;
  data?: Projects;
}

export const CreateProjectForm = ({
  title = "Create",
  data,
}: CreateProjectFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title ?? "",
      short_description: data?.short_description ?? "",
      description: data?.description ?? "",
      images: [],
      position: data?.position ?? 1,
      tags: data?.tags.map((x) => ({ value: x })) ?? [],
      links: data?.links.map((x) => ({ value: x })) ?? [],
      color: data?.color ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let images = [];

    if (values.images) {
      for (let i = 0; i < values.images.length; i++) {
        const response = await storage_service.upload(
          PROJECTS_BUCKET_ID,
          values.images[i].value[0],
        );

        images.push(response.$id);
      }
    }

    const slug = createSlug(values.title);

    const project = {
      title: values.title,
      short_description: values.short_description,
      description: values.description,
      images: images,
      position: values.position,
      tags: values.tags?.map((x) => x.value),
      links: values.links?.map((x) => x.value),
      color: values.color,
      slug: slug,
    };

    try {
      if (data) {
        await database_service.update<Projects>(
          PROJECTS_COLLECTION_ID,
          project,
          slug,
        );
      } else {
        await database_service.create<Projects>(
          PROJECTS_COLLECTION_ID,
          project,
          slug,
        );

        router.push(`/projects/${slug}`);
      }
    } catch (err) {
      const error = err as Error;

      if (
        error.message.includes("Document with the requested ID already exists.")
      ) {
        form.setError("title", {
          type: "manual",
          message: "Project with this title already exists.",
        });
      }
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Sample Project" {...field} />
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
                    <Textarea
                      placeholder="This project is amazing!"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="This project is really really amazing!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ImageArrayInput form={form} title="Images" name="images" />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ArrayInput form={form} title="Tags" name="tags" />
            <ArrayInput form={form} title="Links" name="links" />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#FFFFFF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex=row flex gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
              <Button
                disabled={form.formState.isSubmitting}
                type="button"
                variant="destructive"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
