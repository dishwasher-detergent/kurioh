import { Header } from "@/components/ui/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <main className="mx-auto max-w-6xl space-y-4 p-4 px-4 md:px-8">
        <Header loading={true} />
        <section className="min-h-full columns-xs items-start gap-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              className="h-48 w-full break-inside-avoid-column"
            />
          ))}
        </section>
      </main>
    </>
  );
}
