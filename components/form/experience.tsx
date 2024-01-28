"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ExperienceArrayInput } from "@/components/ui/form/experience-array";
import { Experience } from "@/interfaces/experience";
import { auth_service, database_service } from "@/lib/appwrite";
import { EXPERIENCE_COLLECTION_ID } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { usePortfolioStore } from "@/store/zustand";
import { zodResolver } from "@hookform/resolvers/zod";
import { ID, Permission, Role } from "appwrite";
import { LucideLoader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  experience: z.any().optional(),
});

interface ExperienceFormProps {
  data: Experience[] | null;
}

export const ExperienceForm = ({ data }: ExperienceFormProps) => {
  const { current } = usePortfolioStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience:
        data?.map((x) => ({
          value: {
            id: x.$id,
            company: x.company,
            website: x.website,
            title: x.title,
            description: x.description,
            languages: x?.languages.map((y) => ({ value: y })) ?? [],
            start: x.start ? formatDate(x.start) : null,
            end: x.end ? formatDate(x.end) : null,
          },
        })) ?? [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const experience = values.experience.map((x: any) => ({
      ...x.value,
    }));

    const formIds = experience.map((x: any) => x.id);
    const existingIds = data?.map((x) => x.$id);
    const difference = existingIds?.filter((x) => !formIds.includes(x));

    try {
      const user = await auth_service.getAccount();

      if (difference) {
        for (const id of difference) {
          await database_service.delete(EXPERIENCE_COLLECTION_ID, id);

          toast.error("An error occurred while deleting your experiences.");
        }
      }

      for (const exp of experience) {
        if (exp?.id) {
          await database_service.update<Experience>(
            EXPERIENCE_COLLECTION_ID,
            {
              company: exp.company,
              website: exp.website,
              title: exp.title,
              description: exp.description,
              languages: exp.languages?.map((x: any) => x.value),
              start: exp.start,
              end: exp.end,
            },
            exp.id,
          );

          toast.success("Experience updated successfully.");
        } else {
          const response = await database_service.create<Experience>(
            EXPERIENCE_COLLECTION_ID,
            {
              company: exp.company,
              website: exp.website,
              title: exp.title,
              description: exp.description,
              start: exp.start,
              end: exp.end,
              languages: exp.languages?.map((x: any) => x.value),
              creator: user.$id,
              portfolios: current?.id,
            },
            ID.unique(),
            [
              Permission.read(Role.any()),
              Permission.write(Role.user(user.$id)),
            ],
          );

          const values = form.getValues();

          const newValues = values.experience.map((x: any) => {
            if (x.value.id === exp.id) {
              x.value.id = response.$id;
            }
            return x;
          });

          form.setValue("experience", newValues);

          toast.success(`Experience ${exp.title} created successfully.`);
        }
      }
    } catch (err) {
      toast.error("An error occurred while creating your experiences.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <ExperienceArrayInput form={form} name="experience" />
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
