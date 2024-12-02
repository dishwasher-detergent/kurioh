export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl p-4 px-8">
      <div className="grid place-items-center overflow-hidden rounded-xl border border-dashed p-4 text-sm font-bold text-muted-foreground">
        <h2 className="mb-2 text-xl text-foreground">
          The requested endpoint was not found!
        </h2>
        <p>Switch or create a new endpoint above.</p>
      </div>
    </main>
  );
}
