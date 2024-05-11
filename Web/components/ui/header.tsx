interface HeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const Header = ({
  title,
  description,
  action,
  children,
}: HeaderProps) => {
  return (
    <div className="flex w-full flex-col gap-4 pb-6">
      <header className="border-b py-6">
        <div className="mx-auto flex w-full max-w-7xl items-center px-4">
          <div className="flex-1">
            <h3 className="pb-1 text-3xl font-semibold">{title}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-100">
              {description}
            </p>
          </div>
          <div className="flex-none">{action}</div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl px-4">{children}</div>
    </div>
  );
};
