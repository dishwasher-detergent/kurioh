export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex w-full grow flex-col bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-fg:var(--color-muted)]/50 dark:[--pattern-fg:var(--color-muted)]/10">
      <div className="border-border bg-background mx-auto w-full max-w-6xl flex-1 border-x border-dashed p-4 px-4 md:px-8">
        {children}
      </div>
    </main>
  );
}
