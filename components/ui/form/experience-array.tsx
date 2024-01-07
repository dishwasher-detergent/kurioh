"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LucideGhost, LucidePlus, LucideTrash } from "lucide-react";
import { UseFormReturn, useFieldArray, useFormContext } from "react-hook-form";

interface ExperienceArrayInputProps {
  title: string;
  name: string;
  form: UseFormReturn<any>;
}

export const ExperienceArrayInput = ({
  title,
  name,
  form,
}: ExperienceArrayInputProps) => {
  const { control, register } = form;

  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(name, formState);

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  return (
    <div>
      <Label>
        <p className="pb-3">{title}</p>
      </Label>
      <Card className="p-2">
        <ul className="mb-2 space-y-2 rounded-lg border bg-slate-100 p-4 dark:bg-slate-800 dark:text-slate-300">
          {fields.map((item, index) => {
            return (
              <li
                key={item.id}
                className="flex flex-row items-start gap-4 border-b-2 border-dotted border-slate-300 pb-2 last:border-none"
              >
                <Badge
                  variant="secondary"
                  className="grid h-8 w-8 place-items-center"
                >
                  {index + 1}
                </Badge>
                <div className="flex flex-1 flex-col gap-2">
                  <Input
                    {...register(`${name}.${index}.value.id`)}
                    className="hidden"
                  />
                  <div className="space-y-1">
                    <Label>Title</Label>
                    <Input
                      {...register(`${name}.${index}.value.title`)}
                      className="dark:text-slate-white bg-white dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Textarea
                      {...register(`${name}.${index}.value.description`)}
                      className="dark:text-slate-white bg-white dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <div className="flex w-full flex-row gap-2">
                    <div className="flex-1 space-y-1">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        {...register(`${name}.${index}.value.start`)}
                        className="dark:text-slate-white bg-white dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        {...register(`${name}.${index}.value.end`)}
                        className="dark:text-slate-white bg-white dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  className="flex-none"
                  onClick={() => remove(index)}
                >
                  <LucideTrash className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
          {fields.length === 0 && (
            <li className="flex flex-row items-center text-sm font-semibold text-slate-500 dark:text-slate-300">
              <LucideGhost className="mr-2 h-4 w-4" />
              No {title}
            </li>
          )}
        </ul>
        <Button
          variant="default"
          size="sm"
          type="button"
          onClick={() => {
            append({ value: null });
          }}
        >
          <LucidePlus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </Card>
      <p className="text-red-500 dark:text-red-900">
        {fieldState.error?.message}
      </p>
    </div>
  );
};
