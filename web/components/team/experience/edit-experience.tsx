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
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { AutosizeTextarea } from "@/components/ui/auto-size-textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import {
  EXPERIENCE_COMPANY_MAX_LENGTH,
  EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  EXPERIENCE_TITLE_MAX_LENGTH,
} from "@/constants/experience.constants";
import { Experience } from "@/interfaces/experience.interface";
import { updateTeamExperiences } from "@/lib/db";
import {
  EditExperienceArrayFormData,
  editExperienceArraySchema,
} from "@/lib/db/schemas";
import { cn } from "@/lib/utils";

interface ExperienceFormProps {
  experience: Experience[];
  teamId: string;
}

export default function ExperienceForm({
  experience,
  teamId,
}: ExperienceFormProps) {
  const router = useRouter();

  const form = useForm<EditExperienceArrayFormData>({
    mode: "onChange",
    resolver: zodResolver(editExperienceArraySchema),
    defaultValues: {
      experience:
        experience?.map((exp) => ({
          id: exp?.$id,
          title: exp?.title,
          description: exp?.description,
          start_date: exp?.start_date ? new Date(exp.start_date) : new Date(),
          end_date: exp?.end_date ? new Date(exp.end_date) : undefined,
          company: exp?.company,
          skills:
            exp.skills?.map((skill) => ({ label: skill, value: skill })) ?? [],
          website: exp.website?.toString(),
        })) ?? [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const experiences = useWatch({
    control: form.control,
    name: "experience",
  });

  const sortExperiences = () => {
    const sortedIndices = [...experiences]
      .map((exp, index) => ({
        index,
        date: !exp.end_date
          ? new Date(8640000000000000)
          : new Date(exp.end_date),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map((item) => item.index);

    for (let i = 0; i < sortedIndices.length; i++) {
      if (sortedIndices[i] !== i) {
        move(sortedIndices[i], i);
        return;
      }
    }
  };

  useEffect(() => {
    if (experiences && experiences.length > 1) {
      sortExperiences();
    }
  }, [experiences?.map((exp) => exp?.end_date?.toString())?.join()]);

  const isPresentJob = (index: number) => {
    const endDate = form.watch(`experience.${index}.end_date`);
    return !endDate;
  };

  const handlePresentChange = (index: number, isPresent: boolean) => {
    if (isPresent) {
      form.setValue(`experience.${index}.end_date`, undefined);
    } else {
      form.setValue(`experience.${index}.end_date`, new Date());
    }
  };

  async function onSubmit(values: EditExperienceArrayFormData) {
    try {
      const result = await updateTeamExperiences({
        teamId,
        experiences: values.experience,
      });

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update experiences.");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {fields.map((field, index) => {
            const isPresent = isPresentJob(index);

            return (
              <Card
                key={field.id}
                className="relative gap-0 overflow-hidden p-0"
              >
                <CardHeader className="p-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center text-base font-medium">
                      {form.watch(`experience.${index}.company`) ||
                        "New Experience"}
                    </CardTitle>
                    <CardDescription>
                      {form.watch(`experience.${index}.title`) &&
                        form.watch(`experience.${index}.title`)}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 p-4">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.id`}
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} className="hidden" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Company
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder="Company Name"
                                className="truncate pr-20"
                                maxLength={EXPERIENCE_COMPANY_MAX_LENGTH}
                              />
                              <Badge
                                className="absolute top-1/2 right-1.5 -translate-y-1/2"
                                variant="secondary"
                              >
                                {field?.value?.length || 0}/
                                {EXPERIENCE_COMPANY_MAX_LENGTH}
                              </Badge>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Job Title
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder="Senior Software Engineer"
                                className="truncate pr-20"
                                maxLength={EXPERIENCE_TITLE_MAX_LENGTH}
                              />
                              <Badge
                                className="absolute top-1/2 right-1.5 -translate-y-1/2"
                                variant="secondary"
                              >
                                {field?.value?.length || 0}/
                                {EXPERIENCE_TITLE_MAX_LENGTH}
                              </Badge>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                              placeholder="Describe your responsibilities, achievements and experience at this company..."
                              className="min-h-[100px] pb-8"
                              maxLength={EXPERIENCE_DESCRIPTION_MAX_LENGTH}
                            />
                            <Badge
                              className="absolute bottom-2 left-2"
                              variant="secondary"
                            >
                              {field?.value?.length || 0}/
                              {EXPERIENCE_DESCRIPTION_MAX_LENGTH}
                            </Badge>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`experience.${index}.start_date`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
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
                                      format(field.value, "MMMM yyyy")
                                    ) : (
                                      <span>Select start date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <FormField
                            control={form.control}
                            name={`experience.${index}.end_date`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value &&
                                            !isPresent &&
                                            "text-muted-foreground",
                                          isPresent && "opacity-50",
                                        )}
                                        disabled={isPresent}
                                      >
                                        {field.value ? (
                                          format(field.value, "MMMM yyyy")
                                        ) : isPresent ? (
                                          <span>Present</span>
                                        ) : (
                                          <span>Select end date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date("1900-01-01")
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
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`current-job-${index}`}
                            checked={isPresent}
                            onChange={(e) =>
                              handlePresentChange(index, e.target.checked)
                            }
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`current-job-${index}`}
                            className="text-muted-foreground text-sm"
                          >
                            I currently work here
                          </label>
                        </div>
                      </div>
                    </div>
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
                  <FormField
                    control={form.control}
                    name={`experience.${index}.website`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Company Website
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://company.com"
                            className="truncate"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between border-t p-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => remove(index)}
                      variant="destructive"
                      className="h-8"
                    >
                      <LucideTrash className="mr-1 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <div className="mt-6 flex flex-row gap-2">
          <Button
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
            variant="outline"
          >
            <LucidePlus className="mr-2 size-3.5" />
            Add Experience
          </Button>

          {(experience?.length > 0 || fields.length > 0) && (
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
            >
              {form.formState.isSubmitting ? (
                <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
              ) : (
                <LucideSave className="mr-2 size-3.5" />
              )}
              Save Experiences
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
