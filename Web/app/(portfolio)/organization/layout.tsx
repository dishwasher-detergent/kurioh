export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto min-h-full max-w-6xl p-4 px-4 md:px-8">
      {children}
    </main>
  );
}
