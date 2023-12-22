"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrayInput } from "@/components/ui/form/array";
import { ImageArrayInput } from "@/components/ui/form/image_array";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Projects } from "@/interfaces/projects";
import {
  PROJECTS_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
  database_service,
  storage_service,
} from "@/lib/appwrite";
import { createSlug } from "@/lib/utils";
import { usePortfolioStore } from "@/store/zustand";
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
        value: z.string().min(1).max(128),
      }),
    ),
  ),
  links: z.optional(
    z.array(
      z.object({
        value: z.string().min(1).max(128),
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
  const edit = data ? true : false;
  const router = useRouter();
  const { toast } = useToast();
  const { current } = usePortfolioStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title ?? "",
      short_description: data?.short_description ?? "",
      description: data?.description ?? "",
      images: data?.images.map((x) => ({ value: x })) ?? [],
      position: data?.position ?? 1,
      tags: data?.tags.map((x) => ({ value: x })) ?? [],
      links: data?.links.map((x) => ({ value: x })) ?? [],
      color: data?.color ?? "",
    },
  });

  async function deleteProject() {
    if (!data) return;

    try {
      await database_service.delete(PROJECTS_COLLECTION_ID, data?.$id);

      toast({
        title: "Project Deleted.",
        description: `Project ${data.title} deleted successfully.`,
      });

      router.push(`/projects`);
    } catch (err) {
      const error = err as Error;

      toast({
        variant: "destructive",
        title: "An error occurred while deleting your project.",
        description: error.message,
      });
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let images = [];

    const existing_images =
      values?.images
        .filter((x) => typeof x.value == "string")
        .map((x) => x.value) ?? [];

    try {
      if (values.images) {
        for (let i = 0; i < values.images.length; i++) {
          if (
            values.images[i].value &&
            typeof values.images[i].value !== "string"
          ) {
            const response = await storage_service.upload(
              PROJECTS_BUCKET_ID,
              values.images[i].value[0],
            );

            images.push(response.$id);

            toast({
              title: "Uploaded.",
              description: `Image ${response.name} uploaded successfully.`,
            });
          }
        }
      }
    } catch (err) {
      const error = err as Error;

      toast({
        variant: "destructive",
        title: "An error occurred while uploading your images.",
        description: error.message,
      });
    }

    images = [...existing_images, ...images];

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
      portfolios: current?.id,
    };

    try {
      if (data) {
        await database_service.update<Projects>(
          PROJECTS_COLLECTION_ID,
          project,
          slug,
        );

        toast({
          title: "Project Updated.",
          description: `Project ${values.title} updated successfully.`,
        });
      } else {
        await database_service.create<Projects>(
          PROJECTS_COLLECTION_ID,
          project,
        );

        toast({
          title: "Project Created.",
          description: `Project ${values.title} created successfully.`,
        });

        router.push(`/${current?.id}/projects/${slug}`);
      }
    } catch (err) {
      const error = err as Error;

      toast({
        variant: "destructive",
        title: "An error occurred while creating your project.",
        description: error.message,
      });

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              disabled={edit}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Sample Project" {...field} />
                  </FormControl>
                  {edit && (
                    <FormDescription>
                      The title cannot be updated.
                    </FormDescription>
                  )}
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
          </CardContent>
          <CardFooter className="flex flex-row justify-end">
            {edit && (
              <div className="flex-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={form.formState.isSubmitting}
                      type="button"
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete this project.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => deleteProject()}
                        >
                          Yes
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          No
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <div className="flex flex-none flex-row gap-2">
              <Button
                disabled={form.formState.isSubmitting}
                type="button"
                variant="destructive"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
