import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";

interface HeaderProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
}

export function Header({ children, src, alt }: HeaderProps) {
  return (
    <header className="relative">
      <div
        role="img"
        aria-label="Banner"
        className="from-primary to-secondary h-24 w-full rounded-xl bg-linear-to-r md:h-48"
      />
      <div className="-mt-15 flex items-start justify-between px-4 md:-mt-30">
        <figure className="relative size-24 flex-shrink-0 md:size-60">
          <AspectRatio ratio={1}>
            {src ? (
              <Image
                src={src}
                alt={alt ?? "Picture"}
                className="border-background bg-primary size-full rounded-full border-4 object-cover"
                fill
                priority
              />
            ) : (
              <div
                aria-label="Default picture"
                className="border-background bg-primary text-primary-foreground grid size-full place-items-center rounded-full border-4 object-cover font-bold"
              >
                No Image
              </div>
            )}
          </AspectRatio>
        </figure>
        <div className="flex flex-row gap-1 pt-16 md:pt-32">{children}</div>
      </div>
    </header>
  );
}
