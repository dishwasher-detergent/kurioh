import { Nav } from "@/components/ui/nav";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      data-vaul-drawer-wrapper
      className="flex w-full grow flex-col bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-fg:var(--color-muted)]"
    >
      <Nav />
      <section className="border-border bg-background mx-auto w-full max-w-6xl flex-1 border-x border-dashed p-4 px-4 md:px-8">
        {children}
      </section>
    </main>
  );
}
