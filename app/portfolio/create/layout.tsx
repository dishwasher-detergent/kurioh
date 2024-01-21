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
      <header>
        <h3 className="pb-1 text-3xl font-bold">Create Your Portfolio!</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          The best place to store all your information.
        </p>
      </header>
      {children}
    </div>
  );
}
