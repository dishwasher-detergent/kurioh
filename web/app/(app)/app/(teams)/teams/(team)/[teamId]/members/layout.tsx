export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="mb-6">
        <h2 className="font-bold text-xl mb-1">Members</h2>
        <p className="text-sm font-semibold">All members of this team.</p>
      </header>
      {children}
    </>
  );
}
