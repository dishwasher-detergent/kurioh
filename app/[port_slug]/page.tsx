import { InformationForm } from "@/components/form/information";
import { Information, Social } from "@/interfaces/information";
import { Portfolios } from "@/interfaces/portfolios";
import { PORTFOLIO_COLLECTION_ID, database_service } from "@/lib/appwrite";
import { Query } from "appwrite";

async function fetchInformation(port_slug: string) {
  const response = await database_service.list<Portfolios>(
    PORTFOLIO_COLLECTION_ID,
    [Query.equal("slug", port_slug), Query.limit(1)],
  );

  const portfolio = response.documents[0];
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
      <h3 className="text-2xl font-bold">Portfolio</h3>
      <InformationForm data={information} />
    </div>
  );
}
