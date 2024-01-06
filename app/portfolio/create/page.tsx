import { CreatePortfolioForm } from "@/components/form/portfolio";
import { BreadCrumb } from "@/components/ui/breadcrumb";

export default async function PortfolioCreate() {
  return (
    <div className="flex flex-col gap-4">
      <BreadCrumb />
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
