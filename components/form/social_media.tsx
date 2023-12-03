"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  github: z.optional(
    z
      .string()
      .max(128, { message: "Username must be less than 128 characters" }),
  ),
  gitlab: z.optional(
    z
      .string()
      .max(128, { message: "Username must be less than 128 characters" }),
  ),
  bitbucket: z.optional(
    z
      .string()
      .max(128, { message: "Username must be less than 128 characters" }),
  ),
  codepen: z.optional(
    z
      .string()
      .max(128, { message: "Username must be less than 128 characters" }),
  ),
  twitter: z.optional(
    z
      .string()
      .max(128, { message: "Username must be less than 128 characters" }),
  ),
  linkedin: z.optional(
    z
      .string()
      .max(128, { message: "Username must be less than 128 characters" }),
  ),
});

export const SocialMediaForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      github: "",
      gitlab: "",
      bitbucket: "",
      codepen: "",
      twitter: "",
      linkedin: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center">
                      <p className="grid h-9 place-items-center rounded-l-md border border-slate-700 bg-slate-900 px-2 text-sm font-bold text-white">
                        https://github.com/
                      </p>
                      <Input
                        className="rounded-l-none"
                        placeholder="dishwasher-detergent"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Your GitHub username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bitbucket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BitBucket</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center">
                      <p className="grid h-9 place-items-center rounded-l-md border border-slate-700 bg-slate-900 px-2 text-sm font-bold text-white">
                        https://bitbucket.org/
                      </p>
                      <Input
                        className="rounded-l-none"
                        placeholder="dishwasher-detergent"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Your BitBucket username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gitlab"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitLab</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center">
                      <p className="grid h-9 place-items-center rounded-l-md border border-slate-700 bg-slate-900 px-2 text-sm font-bold text-white">
                        https://gitlab.com/
                      </p>
                      <Input
                        className="rounded-l-none"
                        placeholder="diswasher-detergent"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Your GitLab username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codepen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CodePen</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center">
                      <p className="grid h-9 place-items-center rounded-l-md border border-slate-700 bg-slate-900 px-2 text-sm font-bold text-white">
                        https://codepen.com/
                      </p>
                      <Input
                        className="rounded-l-none"
                        placeholder="kennethbass"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Your CodePen username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center">
                      <p className="grid h-9 place-items-center rounded-l-md border border-slate-700 bg-slate-900 px-2 text-sm font-bold text-white">
                        https://twitter.com/
                      </p>
                      <Input
                        className="rounded-l-none"
                        placeholder="aNinjaHobo"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Your Twitter handle.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center">
                      <p className="grid h-9 place-items-center rounded-l-md border border-slate-700 bg-slate-900 px-2 text-sm font-bold text-white">
                        https://linkedin.com/in/
                      </p>
                      <Input
                        className="rounded-l-none"
                        placeholder="kennethtylerbass"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your LinkedIn profile name from linkedin.com/in/profilename.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
