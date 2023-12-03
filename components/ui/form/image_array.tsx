"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LucideGhost, LucidePlus, LucideTrash } from "lucide-react";
import { useState } from "react";
import { UseFormReturn, useFieldArray, useFormContext } from "react-hook-form";

interface ImageArrayInputProps {
  title: string;
  name: string;
  form: UseFormReturn<any>;
}

interface Preview {
  id: string;
  url: string;
}

export const ImageArrayInput = ({
  title,
  name,
  form,
}: ImageArrayInputProps) => {
  const imageName = name;

  const { control, register } = form;

  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(name, formState);

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  const [preview, setPreview] = useState<Preview[]>([]);

  const handleUploadedFile = (
    event: React.FormEvent<HTMLInputElement>,
    id: string,
  ) => {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (!file) {
      return;
    }

    const urlImage = URL.createObjectURL(file);

    const index = preview.findIndex((x) => x.id === id);

    if (index !== -1) {
      preview[index] = { id: id, url: urlImage };
      setPreview(preview);
    } else {
      setPreview([...preview, { id: id, url: urlImage }]);
    }
  };

  return (
    <div>
      <Label>
        <p className="pb-3">{title}</p>
      </Label>
      <Card className="p-2">
        <ul className="mb-2 flex flex-row flex-wrap gap-2 rounded-lg border bg-slate-100 p-4">
          {fields.map((item, index) => {
            return (
              <li key={item.id} className="relative h-24 w-24 rounded-lg">
                <Label className="cursor-pointer">
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    {...register(`${name}.${index}.value`, {
                      onChange: (e: React.FormEvent<HTMLInputElement>) =>
                        handleUploadedFile(e, item.id),
                    })}
                  />
                  {preview.find((x) => x.id === item.id) ? (
                    <div className="h-full w-full overflow-hidden rounded-lg">
                      <img
                        className="h-full w-full object-cover"
                        src={preview.find((x) => x.id === item.id)?.url}
                      />
                    </div>
                  ) : (
                    <div className="grid h-full w-full place-items-center rounded-lg border border-slate-300 bg-slate-200">
                      <LucidePlus className="h-4 w-4" />
                    </div>
                  )}
                </Label>
                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  className="absolute right-2 top-2"
                  onClick={() => remove(index)}
                >
                  <LucideTrash className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
          {fields.length === 0 && (
            <li className="flex flex-row items-center text-sm font-semibold text-slate-500">
              <LucideGhost className="mr-2 h-4 w-4" />
              No {title}
            </li>
          )}
        </ul>
        <Button
          variant="default"
          size="sm"
          type="button"
          className="bg-blue-600"
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
