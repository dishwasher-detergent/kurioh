import { ENDPOINT, PROJECT_BUCKET_ID, PROJECT_ID } from "@/lib/constants";
import { LucideImage } from "lucide-react";

export interface ImagesProps {
  images: string[];
}

export function Images({ images }: ImagesProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className="aspect-square w-full overflow-hidden rounded-lg">
        <img
          className="h-full w-full object-cover"
          src={`${ENDPOINT}/storage/buckets/${PROJECT_BUCKET_ID}/files/${images[0]}/view?project=${PROJECT_ID}`}
          alt="Project image."
        />
      </div>
      <div className="grid grid-cols-3 gap-1">
        {images.map((image, index) => {
          if (index === 0) return null;
          if (index === 3)
            return (
              <div
                key={index}
                className="bg-muted text-muted-foreground flex h-full w-full flex-col place-items-center items-center justify-center rounded-lg border text-base font-bold"
              >
                <LucideImage className="h-6 w-6" />
                <span>+{images.length - 3}</span>
              </div>
            );
          if (index > 3) return null;

          return (
            <div
              key={image}
              className="aspect-video h-full w-full overflow-hidden rounded-lg"
            >
              <img
                className="h-full w-full object-cover"
                src={`${ENDPOINT}/storage/buckets/${PROJECT_BUCKET_ID}/files/${image}/view?project=${PROJECT_ID}`}
                alt="Project image."
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
