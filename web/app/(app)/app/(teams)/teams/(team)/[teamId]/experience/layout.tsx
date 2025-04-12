export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="mb-6">
        <h2 className="font-bold text-xl mb-1">Experience</h2>
        <p className="text-sm font-semibold">
          Add Your Job, Volunteer, or Project Experience.
        </p>
      </header>
      {children}
    </>
  );
}
