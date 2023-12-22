import { InformationForm } from "@/components/form/information";
import { BreadCrumb } from "@/components/ui/breadcrumb";
import { Information, Social } from "@/interfaces/information";
import { Portfolios } from "@/interfaces/portfolios";
import { PORTFOLIO_COLLECTION_ID, database_service } from "@/lib/appwrite";

async function fetchInformation(port_slug: string) {
  const response = await database_service.get<Portfolios>(
    PORTFOLIO_COLLECTION_ID,
    port_slug,
  );

  const portfolio = response;
  const { information } = portfolio;

  if (information.length > 0) {
    const social = information[0].social.map((item) => {
      return JSON.parse(item as string) as Social;
    });

    const info: Information = {
      ...information[0],
      social,
    };

    return info;
  }

  return information[0];
}

export default async function Portfolio({
  params,
}: {
  params: { port_slug: string };
}) {
  const { port_slug } = params;
  const information = await fetchInformation(port_slug);

  return (
    <div className="flex flex-col gap-4">
      <nav>
        <BreadCrumb />
        <h3 className="pb-1 text-3xl font-bold">Portfolio Information</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          Basic information about your portfolio.
        </p>
      </nav>
      <InformationForm data={information} />
    </div>
  );
}
