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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  EDUCATION_DEGREE_MAX_LENGTH,
  EDUCATION_MAJOR_MAX_LENGTH,
  EDUCATION_SCHOOL_MAX_LENGTH,
} from "@/constants/education.constants";
import { Education } from "@/interfaces/education.interface";
import { updateTeamEducations } from "@/lib/db";
import {
  EditEducationArrayFormData,
  editEducationArraySchema,
} from "@/lib/db/schemas";
import { cn } from "@/lib/utils";

interface EducationFormProps {
  education: Education[];
  teamId: string;
}

export default function EducationForm({
  education,
  teamId,
}: EducationFormProps) {
  const router = useRouter();

  const form = useForm<EditEducationArrayFormData>({
    mode: "onChange",
    resolver: zodResolver(editEducationArraySchema),
    defaultValues: {
      education:
        education?.map((ed) => ({
          id: ed?.$id,
          school: ed?.school,
          major: ed?.major,
          degree: ed?.degree,
          start_date: ed?.start_date ? new Date(ed.start_date) : new Date(),
          end_date: ed?.end_date ? new Date(ed.end_date) : undefined,
        })) ?? [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const educations = useWatch({
    control: form.control,
    name: "education",
  });

  const sortEducations = () => {
    const sortedIndices = [...educations]
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
    if (educations && educations.length > 1) {
      sortEducations();
    }
  }, [educations?.map((exp) => exp?.end_date?.toString())?.join()]);

  const isUnknownJob = (index: number) => {
    const endDate = form.watch(`education.${index}.end_date`);
    return !endDate;
  };

  const handleCheckbox = (index: number, isUnknown: boolean) => {
    if (isUnknown) {
      form.setValue(`education.${index}.end_date`, undefined);
    } else {
      form.setValue(`education.${index}.end_date`, education[index]?.end_date);
    }
  };

  async function onSubmit(values: EditEducationArrayFormData) {
    try {
      const result = await updateTeamEducations({
        teamId,
        educations: values.education,
      });

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update educations.");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {fields.map((field, index) => {
            const isUnknown = isUnknownJob(index);

            return (
              <Card
                key={field.id}
                className="relative gap-0 overflow-hidden p-0"
              >
                <CardHeader className="p-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center text-base font-medium">
                      {form.watch(`education.${index}.school`) ||
                        "New Education"}
                    </CardTitle>
                    <CardDescription>
                      {form.watch(`education.${index}.major`) &&
                        form.watch(`education.${index}.major`)}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 p-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.id`}
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
                    name={`education.${index}.school`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          School/University
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="University of Central Oklahoma"
                              className="truncate pr-20"
                              maxLength={EDUCATION_SCHOOL_MAX_LENGTH}
                            />
                            <Badge
                              className="absolute top-1/2 right-1.5 -translate-y-1/2"
                              variant="secondary"
                            >
                              {field?.value?.length || 0}/
                              {EDUCATION_SCHOOL_MAX_LENGTH}
                            </Badge>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`education.${index}.major`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Major
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder="Management Information Systems"
                                className="truncate pr-20"
                                maxLength={EDUCATION_MAJOR_MAX_LENGTH}
                              />
                              <Badge
                                className="absolute top-1/2 right-1.5 -translate-y-1/2"
                                variant="secondary"
                              >
                                {field?.value?.length || 0}/
                                {EDUCATION_MAJOR_MAX_LENGTH}
                              </Badge>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Degree
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder="BBA"
                                className="truncate pr-20"
                                maxLength={EDUCATION_DEGREE_MAX_LENGTH}
                              />
                              <Badge
                                className="absolute top-1/2 right-1.5 -translate-y-1/2"
                                variant="secondary"
                              >
                                {field?.value?.length || 0}/
                                {EDUCATION_DEGREE_MAX_LENGTH}
                              </Badge>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`education.${index}.start_date`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "bg-card pl-3 text-left font-normal",
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
                            name={`education.${index}.end_date`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Graduation Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "bg-card w-full pl-3 text-left font-normal",
                                          !field.value &&
                                            !isUnknown &&
                                            "text-muted-foreground",
                                          isUnknown && "opacity-50",
                                        )}
                                        disabled={isUnknown}
                                      >
                                        {field.value ? (
                                          format(field.value, "MMMM yyyy")
                                        ) : isUnknown ? (
                                          <span>Unknown</span>
                                        ) : (
                                          <span>Select graduation date</span>
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
                          <Checkbox
                            id={`current-job-${index}`}
                            checked={isUnknown}
                            onCheckedChange={(e) => {
                              if (typeof e === "boolean") {
                                handleCheckbox(index, e);
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <label
                            htmlFor={`current-job-${index}`}
                            className="text-muted-foreground text-sm"
                          >
                            Unknown Graduation Date
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
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
                school: "",
                major: "",
                degree: "",
                start_date: new Date(),
                end_date: undefined,
              })
            }
            variant="outline"
          >
            <LucidePlus className="mr-2 size-3.5" />
            Add Education
          </Button>

          {(education?.length > 0 || fields.length > 0) && (
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
              Save Educations
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
