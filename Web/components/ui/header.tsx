import { Skeleton } from "./skeleton";

interface HeaderProps {
  title?: string;
  slug?: string;
  endpoint?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

export function Header({
  title,
  slug,
  loading = false,
  children,
}: HeaderProps) {
  return (
    <header className="mb-8 flex w-full items-start justify-between gap-4">
      <div className="space-y-2">
        {!loading ? (
          <p className="truncate text-sm text-muted-foreground">{slug}</p>
        ) : (
          <Skeleton className="h-6 w-20" />
        )}
        {!loading ? (
          <h1 className="truncate text-3xl font-bold">{title}</h1>
        ) : (
          <Skeleton className="h-8 w-36 max-w-full" />
        )}
      </div>
      <div>{children}</div>
    </header>
  );
}
