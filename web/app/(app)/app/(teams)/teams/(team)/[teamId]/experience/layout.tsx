export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="mb-6">
        <h2 className="mb-1 text-xl font-bold">Experience</h2>
        <p className="text-sm font-semibold">
          Add Your Job, Volunteer, or Project Experience.
        </p>
      </header>
      {children}
    </>
  );
}
