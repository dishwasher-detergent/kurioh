import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ENDPOINT, PROJECTS_BUCKET_ID, PROJECT_ID } from "@/lib/constants";
import { ID } from "appwrite";
import { LucideImagePlus, LucideLoader2, LucideTrash } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageArrayInputProps {
  value?: (string | File)[];
  onChange?: (images: (File | string)[]) => void;
}

interface Preview {
  id: string;
  url: string;
}

export function MultiplePhotoSelector({
  value,
  onChange,
}: ImageArrayInputProps) {
  const [preview, setPreview] = useState<Preview[]>([]);
  const [images, setImages] = useState<(File | string)[]>(value ?? []);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  async function handleUploadedFile(event: React.FormEvent<HTMLInputElement>) {
    setCreateLoading(true);
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (!file) {
      return;
    }

    const urlImage = URL.createObjectURL(file);

    const imageObject = {
      id: ID.unique(),
      url: urlImage,
    };

    const previewImages = [...preview, imageObject];
    setPreview(previewImages);

    const newImages = [
      ...images,
      new File([file], imageObject.id, { type: file.type }),
    ];
    setImages(newImages);
    onChange?.(newImages);

    setCreateLoading(false);
  }

  async function handleDeleteFile(id: string) {
    setDeleteLoading(id);
    const previewImages = preview.filter((item) => item.id !== id);
    setPreview(previewImages);

    const newImages = images.filter((item) => {
      if (item instanceof File) {
        return item.name !== id;
      }

      return item !== id;
    });

    setImages(newImages);
    onChange?.(newImages);
    setDeleteLoading(null);
  }

  useEffect(() => {
    const images: Preview[] = [];

    if (!value) return;

    for (let i = 0; i < value.length; i++) {
      let file = value[i];
      let id = value[i] as string;

      if (file instanceof File) {
        id = (value[i] as File).name;
      }

      images.push({
        id: id,
        url: `${ENDPOINT}/storage/buckets/${PROJECTS_BUCKET_ID}/files/${value[i]}/view?project=${PROJECT_ID}`,
      });
    }

    setPreview(images);
  }, []);

  return (
    <div>
      <Card className="bg-background p-2 shadow-none">
        <ul className="flex flex-row flex-wrap gap-2">
          <li>
            <label className="cursor-pointer">
              <input
                className="hidden"
                type="file"
                accept="image/*"
                disabled={createLoading}
                onChange={(e) => handleUploadedFile(e)}
              />
              <div className="grid h-24 w-24 place-items-center rounded-lg border bg-muted text-muted-foreground">
                {createLoading ? (
                  <LucideLoader2 className="size-4 animate-spin" />
                ) : (
                  <LucideImagePlus className="size-6" />
                )}
              </div>
            </label>
          </li>
          {preview?.map((item) => {
            return (
              <li key={item.id} className="relative h-24 w-24 rounded-lg">
                <div className="h-full w-full overflow-hidden rounded-lg border">
                  <img
                    className="h-full w-full object-cover"
                    src={item.url}
                    alt="Project image."
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  className="absolute right-2 top-2 h-6 w-6"
                  disabled={deleteLoading !== null}
                  onClick={() => handleDeleteFile(item.id)}
                >
                  {deleteLoading && deleteLoading == item.id ? (
                    <LucideLoader2 className="size-4 animate-spin" />
                  ) : (
                    <LucideTrash className="h-4 w-4" />
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
