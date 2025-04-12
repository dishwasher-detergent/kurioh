export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="mb-6">
        <h2 className="mb-1 text-xl font-bold">Information</h2>
        <p className="text-sm font-semibold">Basic portfolio information.</p>
      </header>
      {children}
    </>
  );
}
