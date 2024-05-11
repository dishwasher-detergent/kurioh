"use client";

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
import { ImageInput } from "@/components/ui/form/image";
import { Input } from "@/components/ui/input";
import {
  BITBUCKET,
  CODEPEN,
  GITHUB,
  GITLAB,
  LINKEDIN,
  TWITTER,
} from "@/constants/socials";
import { Information, Social } from "@/interfaces/information";
import {
  auth_service,
  database_service,
  storage_service,
} from "@/lib/appwrite";
import {
  INFORMATION_COLLECTION_ID,
  PORTFOLIO_BUCKET_ID,
} from "@/lib/constants";
import { usePortfolioStore } from "@/store/zustand";
import { zodResolver } from "@hookform/resolvers/zod";
import { ID, Permission, Role } from "appwrite";
import { LucideLoader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(512),
  image: z.any(),
  github: z.string().max(128),
  gitlab: z.string().max(128),
  bitbucket: z.string().max(128),
  codepen: z.string().max(128),
  twitter: z.string().max(128),
  linkedin: z.string().max(128),
});

interface InformationFormProps {
  data: Information | null;
}

export const InformationForm = ({ data }: InformationFormProps) => {
  const { current } = usePortfolioStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title ?? "",
      description: data?.description ?? "",
      image: data?.icon ?? "",
      github:
        (
          data?.social.find(
            (x) => typeof x !== "string" && x.url.includes("github"),
          ) as Social
        )?.value ?? "",
      gitlab:
        (
          data?.social.find(
            (x) => typeof x !== "string" && x.url.includes("gitlab"),
          ) as Social
        )?.value ?? "",
      bitbucket:
        (
          data?.social.find(
            (x) => typeof x !== "string" && x.url.includes("bitbucket"),
          ) as Social
        )?.value ?? "",
      codepen:
        (
          data?.social.find(
            (x) => typeof x !== "string" && x.url.includes("codepen"),
          ) as Social
        )?.value ?? "",
      twitter:
        (
          data?.social.find(
            (x) => typeof x !== "string" && x.url.includes("twitter"),
          ) as Social
        )?.value ?? "",
      linkedin:
        (
          data?.social.find(
            (x) => typeof x !== "string" && x.url.includes("linkedin"),
          ) as Social
        )?.value ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let image = null;

    try {
      if (values.image && typeof values.image !== "string") {
        image = await storage_service.upload(
          PORTFOLIO_BUCKET_ID,
          values.image[0],
        );

        toast.success(`Image ${image.name} uploaded successfully.`);
      }
    } catch (err) {
      toast.error("An error occurred while uploading your images.");
    }

    const social = [
      `{"url":"${BITBUCKET}","value":"${values.bitbucket}"}`,
      `{"url":"${CODEPEN}","value":"${values.codepen}"}`,
      `{"url":"${GITHUB}","value":"${values.github}"}`,
      `{"url":"${GITLAB}","value":"${values.gitlab}"}`,
      `{"url":"${LINKEDIN}","value":"${values.linkedin}"}`,
      `{"url":"${TWITTER}","value":"${values.twitter}"}`,
    ];

    const information = {
      title: values.title,
      description: values.description,
      icon: image?.$id ?? values.image,
      social: social.filter((item) => JSON.parse(item).value !== ""),
      portfolios: current?.id,
    };

    console.log(information);

    try {
      if (data?.$id) {
        await database_service.update<Information>(
          INFORMATION_COLLECTION_ID,
          information,
          data.$id,
        );

        toast.success("Information updated successfully.");
      } else {
        const user = await auth_service.getAccount();

        await database_service.create<Information>(
          INFORMATION_COLLECTION_ID,
          { ...information, creator: user.$id },
          ID.unique(),
          [Permission.read(Role.any()), Permission.write(Role.user(user.$id))],
        );

        toast.success("Information created successfully.");
      }
    } catch (err) {
      const error = err as Error;

      toast.error("An error occurred while uploading your images.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Kenneth Bass' Portfolio" {...field} />
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
                  <Input
                    placeholder="This is my portfolio, full of amazing projects!"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ImageInput form={form} label="Favicon" />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <div className="flex flex-row items-center">
                    <p className="grid h-9 place-items-center rounded-l-md border bg-slate-900 px-2 text-sm font-bold text-white">
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
                    <p className="grid h-9 place-items-center rounded-l-md border  bg-slate-900 px-2 text-sm font-bold text-white">
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
                    <p className="grid h-9 place-items-center rounded-l-md border  bg-slate-900 px-2 text-sm font-bold text-white">
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
                    <p className="grid h-9 place-items-center rounded-l-md border  bg-slate-900 px-2 text-sm font-bold text-white">
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
                    <p className="grid h-9 place-items-center rounded-l-md border  bg-slate-900 px-2 text-sm font-bold text-white">
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
                    <p className="grid h-9 place-items-center rounded-l-md border  bg-slate-900 px-2 text-sm font-bold text-white">
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
        </div>
        <footer className="flex flex-row justify-end gap-2">
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
        </footer>
      </form>
    </Form>
  );
};
