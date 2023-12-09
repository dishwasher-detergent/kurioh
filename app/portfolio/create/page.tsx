import { CreatePortfolioForm } from "@/components/form/portfolio";

export default function PortfolioCreate() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold">Portfolio</h3>
      <CreatePortfolioForm />
    </div>
  );
}
