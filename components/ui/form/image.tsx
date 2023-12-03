"use client";

import { Label } from "@/components/ui/label";
import { LucidePlus } from "lucide-react";
import { useState } from "react";

export const ImageInput = ({ register }: any) => {
  const [preview, setPreview] = useState<any>(null);

  const handleUploadedFile = (event: React.FormEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (!file) {
      return;
    }

    const urlImage = URL.createObjectURL(file);
    setPreview(urlImage);
  };

  return (
    <div>
      <Label className="cursor-pointer">
        Icon
        <input
          className="hidden"
          type="file"
          accept="image/*"
          {...register("image", {
            onChange: (e: React.FormEvent<HTMLInputElement>) =>
              handleUploadedFile(e),
          })}
        />
        <div className="pt-2">
          {preview ? (
            <img src={preview} className="h-24 w-24 rounded-lg" />
          ) : (
            <div className="grid h-24 place-items-center rounded-lg bg-slate-200 text-slate-950">
              <LucidePlus className="h-4 w-4" />
            </div>
          )}
        </div>
      </Label>
    </div>
  );
};
