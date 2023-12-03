"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucidePlus, LucideTrash } from "lucide-react";
import { UseFormReturn, useFieldArray, useFormContext } from "react-hook-form";

interface ArrayInputProps {
  title: string;
  name: string;
  form: UseFormReturn<any>;
}

export const ArrayInput = ({ title, name, form }: ArrayInputProps) => {
  const { control, register } = form;

  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(name, formState);

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  return (
    <div>
      <Label className="cursor-pointer">
        <p className="pb-3">{title}</p>
        <ul className="mb-2 space-y-2 rounded-lg border bg-slate-100 p-4">
          {fields.map((item, index) => {
            return (
              <li key={item.id} className="flex flex-row gap-2">
                <Input
                  {...register(`${name}.${index}.value`)}
                  className="bg-background"
                />
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
            <li className="text-slate-500">No {title}</li>
          )}
        </ul>
        <Button
          variant="default"
          size="icon"
          type="button"
          className="bg-blue-600"
          onClick={() => {
            append({ value: null });
          }}
        >
          <LucidePlus className="h-4 w-4" />
        </Button>
      </Label>
      <p className="text-red-500 dark:text-red-900">
        {fieldState.error?.message}
      </p>
    </div>
  );
};
