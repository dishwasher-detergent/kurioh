interface LayoutProps {
  params: {
    port_slug: string;
    slug: string;
  };
  children: React.ReactNode;
}

export default async function Layout({ params, children }: LayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <header className="py-4">
        <h3 className="pb-1 text-3xl font-bold">Experience</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          All your experience, wrapped up in one place.
        </p>
      </header>
      {children}
    </div>
  );
}
