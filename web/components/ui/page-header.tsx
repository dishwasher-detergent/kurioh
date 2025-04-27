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
    <header className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="mb-1 text-2xl font-bold">{title}</h2>
        {description && <p className="text-sm font-semibold">{description}</p>}
      </div>
      {children}
    </header>
  );
}
