interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid h-full w-full place-items-center bg-muted">
      {children}
    </div>
  );
}
