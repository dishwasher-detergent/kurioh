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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.optional(
    z.string().max(128, { message: "Title must be less than 128 characters." }),
  ),
  short_description: z.optional(
    z.string().max(128, {
      message: "Short Description must be less than 128 characters.",
    }),
  ),
  description: z.optional(
    z
      .string()
      .max(1024, { message: "Description must be less than 1024 characters." }),
  ),
  images: z.optional(
    z.array(
      z.object({
        value: z.any(),
      }),
    ),
  ),
  position: z.optional(z.coerce.number()),
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
  color: z.optional(
    z.string().max(128, { message: "Color must be less than 128 characters." }),
  ),
});

interface CreateProjectFormProps {
  title?: string;
}

export const CreateProjectForm = ({
  title = "Create",
}: CreateProjectFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      short_description: "",
      description: "",
      images: [],
      position: 0,
      tags: [],
      links: [],
      color: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card>
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
              <Button type="submit">Save</Button>
              <Button
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
