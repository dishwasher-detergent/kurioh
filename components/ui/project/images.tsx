interface ImagesProjectProps {
  images: string[];
}

export const ProjectImages = ({ images }: ImagesProjectProps) => {
  return (
    images && (
      <div className="flex w-full flex-col gap-2 overflow-hidden rounded-lg">
        <div className="h-full flex-1">
          <img
            src={images[0]}
            className="aspect-video h-full w-full rounded-lg object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="flex w-full flex-none flex-row gap-2 overflow-y-auto">
            {images.map(
              (image, index) =>
                index !== 0 && (
                  <img
                    key={image}
                    src={image}
                    className="aspect-video h-24 rounded-lg object-cover object-left-top"
                  />
                ),
            )}
          </div>
        )}
      </div>
    )
  );
};
