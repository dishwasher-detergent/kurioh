import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ENDPOINT, PROJECT_BUCKET_ID, PROJECT_ID } from "@/lib/constants";
import { ID } from "appwrite";
import { LucideImagePlus, LucideLoader2, LucideTrash } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageArrayInputProps {
  value?: string | File | null;
  onChange?: (images: File | string | null) => void;
}

interface Preview {
  id: string;
  url: string;
}

export function PhotoSelector({ value, onChange }: ImageArrayInputProps) {
  const [preview, setPreview] = useState<Preview | null>(null);
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

    setPreview(imageObject);

    const newImage = new File([file], imageObject.id, { type: file.type });

    onChange?.(newImage);
    setCreateLoading(false);
  }

  async function handleDeleteFile(id: string) {
    setDeleteLoading(id);
    setPreview(null);
    onChange?.(null);
    setDeleteLoading(null);
  }

  useEffect(() => {
    if (!value) return;

    let file = value;
    let id = value as string;

    if (file instanceof File) {
      id = (value as File).name;
    }

    setPreview({
      id: id,
      url: `${ENDPOINT}/storage/buckets/${PROJECT_BUCKET_ID}/files/${value}/view?project=${PROJECT_ID}`,
    });
  }, []);

  return (
    <div>
      <Card className="bg-background p-2 shadow-none">
        <ul className="flex flex-row flex-wrap gap-2">
          {!preview && (
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
          )}
          {preview && (
            <li className="relative h-24 w-24 rounded-lg">
              <div className="h-full w-full overflow-hidden rounded-lg border">
                <img
                  className="h-full w-full object-cover"
                  src={preview.url}
                  alt="Project image."
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                type="button"
                className="absolute right-2 top-2 h-6 w-6"
                disabled={deleteLoading !== null}
                onClick={() => handleDeleteFile(preview.id)}
              >
                {deleteLoading && deleteLoading == preview.id ? (
                  <LucideLoader2 className="size-4 animate-spin" />
                ) : (
                  <LucideTrash className="h-4 w-4" />
                )}
              </Button>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}
