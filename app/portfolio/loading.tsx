import { InformationFormLoading } from "@/components/form/loading/information";

export default async function PortfolioLoading() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold">Portfolio</h3>
      <InformationFormLoading />
    </div>
  );
}
