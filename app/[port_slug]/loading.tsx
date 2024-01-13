import { InformationFormLoading } from "@/components/form/loading/information";

export default async function PortfolioLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <header className="py-4">
        <h3 className="pb-1 text-3xl font-bold">Portfolio Information</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          Basic information about your portfolio.
        </p>
      </header>
      <InformationFormLoading />
    </div>
  );
}
