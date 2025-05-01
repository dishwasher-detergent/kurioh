export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex w-full flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="w-full">
        <h2 className="mb-1 truncate text-2xl font-bold">{title}</h2>
        {description && <p className="text-sm font-semibold">{description}</p>}
      </div>
      {children}
    </header>
  );
}
