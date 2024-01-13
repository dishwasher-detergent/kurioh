import { CreatePortfolioForm } from "@/components/form/portfolio";

export default async function PortfolioCreate() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <nav>
        <h3 className="pb-1 text-3xl font-bold">Create Your Portfolio!</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          The best place to store all your information.
        </p>
      </nav>
      <CreatePortfolioForm />
    </div>
  );
}
