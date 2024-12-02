export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid min-h-dvh w-full place-items-center p-4">
      {children}
    </main>
  );
}
