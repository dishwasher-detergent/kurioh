export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="mb-6">
        <h2 className="font-bold text-xl mb-1">Information</h2>
        <p className="text-sm font-semibold">Basic portfolio information.</p>
      </header>
      {children}
    </>
  );
}
