interface LayoutProps {
  params: {
    port_slug: string;
    slug: string;
  };
  children: React.ReactNode;
}

export default async function Layout({ params, children }: LayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <header className="py-4">
        <h3 className="pb-1 text-3xl font-bold capitalize">
          Edit {params.slug}
        </h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          Edit your project to make it even better!
        </p>
      </header>
      {children}
    </div>
  );
}
