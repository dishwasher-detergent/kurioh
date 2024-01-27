import { InformationForm } from "@/components/form/information";
import { Header } from "@/components/ui/header";
import { Information, Social } from "@/interfaces/information";
import { Portfolios } from "@/interfaces/portfolios";
import { database_service } from "@/lib/appwrite";
import { PORTFOLIO_COLLECTION_ID } from "@/lib/constants";

async function fetchInformation(port_slug: string) {
  let response;

  try {
    response = await database_service.get<Portfolios>(
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
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function Portfolio({
  params,
}: {
  params: { port_slug: string };
}) {
  const { port_slug } = params;
  const information = await fetchInformation(port_slug);

  return (
    <Header
      title="Portfolio Information"
      description="Basic information about your portfolio."
    >
      <InformationForm data={information} />
    </Header>
  );
}
