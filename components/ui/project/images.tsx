import { LucideImageOff } from "lucide-react";

interface ImagesProjectProps {
  images: string[];
}

export const ProjectImages = ({ images }: ImagesProjectProps) => {
  return images && images.length > 0 ? (
    <div className="flex w-full flex-col gap-2 overflow-hidden rounded-lg">
      <div className="flex-1">
        <img
          src={images[0]}
          className="aspect-square w-full rounded-lg object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex w-full flex-none flex-row gap-2 overflow-y-auto">
          {images.map(
            (image, index) =>
              index !== 0 && (
                <img
                  key={index}
                  src={image}
                  className="aspect-square h-20 rounded-lg object-cover object-left-top"
                />
              ),
          )}
        </div>
      )}
    </div>
  ) : (
    <div className="grid aspect-square w-full place-items-center rounded-lg border bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      <LucideImageOff className="h-6 w-6" />
    </div>
  );
};
