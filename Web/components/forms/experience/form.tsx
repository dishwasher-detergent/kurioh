"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  LucideLoader2,
  LucidePlus,
  LucideSave,
  LucideTrash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AutosizeTextarea } from "@/components/ui/auto-size-textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Experience } from "@/interfaces/experience.interface";
import {
  addExperience,
  removeExperience,
  updateExperience,
} from "@/lib/server/utils";
import { cn } from "@/lib/utils";
import experienceArraySchema, {
  companyMaxLength,
  descriptionMaxLength,
  titleMaxLength,
} from "./schema";

interface ExperienceFormProps {
  experience: Experience[];
  orgId: string;
}

export default function ExperienceForm({
  experience,
  orgId,
}: ExperienceFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof experienceArraySchema>>({
    resolver: zodResolver(experienceArraySchema),
    defaultValues: {
      experience: experience.map((exp) => ({
        id: exp.$id,
        title: exp.title ?? "",
        description: exp.description ?? "",
        start_date: exp.start_date ?? "",
        end_date: exp.end_date ?? "",
        company: exp.company ?? "",
        skills:
          exp.skills?.map((skill) => ({ label: skill, value: skill })) ?? [],
        website: exp.website?.toString() ?? "",
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  useEffect(() => {
    form.reset({
      experience: experience.map((exp) => ({
        id: exp.$id,
        title: exp.title ?? "",
        description: exp.description ?? "",
        start_date: exp.start_date ? new Date(exp.start_date) : undefined,
        end_date: exp.end_date ? new Date(exp.end_date) : undefined,
        company: exp.company ?? "",
        skills:
          exp.skills?.map((skill) => ({ label: skill, value: skill })) ?? [],
        website: exp.website?.toString() ?? "",
      })),
    });
  }, [experience, form]);

  async function onSubmit(values: z.infer<typeof experienceArraySchema>) {
    setLoading(true);

    if (!orgId) return;

    const newExperience = values.experience.map((exp) => ({
      ...exp,
      start_date: exp.start_date.toISOString(),
      end_date: exp.end_date?.toISOString(),
      skills: exp.skills?.map((skill) => skill.value),
      website:
        exp.website && exp.website != "" ? new URL(exp.website) : undefined,
    }));

    const newExperienceIds = newExperience.map((exp) => exp.id);

    const removedExperienceIds = experience.filter(
      (val) => !newExperienceIds.includes(val.$id),
    );

    for (const item of removedExperienceIds) {
      const deleted = await removeExperience(item.$id);

      if (deleted.errors) {
        toast.error(deleted.errors.message);
        continue;
      }

      toast.success("Experience removed successfully.");
    }

    for (let i = 0; i < newExperience.length; i++) {
      const exp = newExperience[i];

      if (exp.id) {
        const updated = await updateExperience(exp.id, exp);

        if (updated.errors) {
          toast.error(updated.errors.message);
          continue;
        }

        toast.success("Experience updated successfully.");
      } else {
        const added = await addExperience(exp, orgId);

        if (added.errors) {
          toast.error(added.errors.message);
          continue;
        }

        toast.success("Experience added successfully.");
      }
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 border-b border-dashed pb-2">
            <FormField
              control={form.control}
              name={`experience.${index}.company`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Company Name"
                        className="truncate pr-20"
                        maxLength={companyMaxLength}
                      />
                      <Badge
                        className="absolute right-1.5 top-1/2 -translate-y-1/2"
                        variant="secondary"
                      >
                        {field?.value?.length}/{companyMaxLength}
                      </Badge>
                    </div>
                  </FormControl>
                  <FormDescription>The company you work for.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`experience.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Senior Software Engineer"
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
                  <FormDescription>
                    The title you held while working here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`experience.${index}.description`}
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
                  <FormDescription>
                    Describe what you did in this organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full space-y-2">
              <div className="flex flex-row gap-2">
                <FormField
                  control={form.control}
                  name={`experience.${index}.start_date`}
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experience.${index}.end_date`}
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-[0.8rem] text-muted-foreground">
                Leave the end date empty if you are still working here.
              </p>
            </div>
            <FormField
              control={form.control}
              name={`experience.${index}.skills`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
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
                    Skills that you have learned or used in this organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`experience.${index}.website`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://company.com"
                      className="truncate pr-20"
                    />
                  </FormControl>
                  <FormDescription>Your companies website.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => remove(index)}
              variant="destructive"
            >
              <LucideTrash className="mr-2 size-3.5" />
              Remove Experience
            </Button>
            <FormField
              control={form.control}
              name={`experience.${index}.id`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} className="hidden" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
        <div className="flex flex-row gap-2">
          {(experience.length > 0 || fields.length > 0) && (
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? (
                <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
              ) : (
                <LucideSave className="mr-2 size-3.5" />
              )}
              Save
            </Button>
          )}
          <Button
            size="sm"
            type="button"
            onClick={() =>
              append({
                title: "",
                description: "",
                start_date: new Date(),
                end_date: undefined,
                company: "",
                skills: [],
                website: "",
              })
            }
          >
            <LucidePlus className="mr-2 size-3.5" />
            Add Experience
          </Button>
        </div>
      </form>
    </Form>
  );
}
