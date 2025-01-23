import { Header } from "@/components/ui/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Header loading={true} />
      <section className="min-h-full columns-xs items-start gap-4 space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            className="h-48 w-full break-inside-avoid-column"
          />
        ))}
      </section>
    </>
  );
}
