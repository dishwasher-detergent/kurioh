import { ExperienceForm } from "@/components/form/experience";
import { Portfolios } from "@/interfaces/portfolios";
import { database_service } from "@/lib/appwrite";
import { PORTFOLIO_COLLECTION_ID } from "@/lib/constants";

async function fetchExperience(port_slug: string) {
  let response;

  try {
    response = await database_service.get<Portfolios>(
      PORTFOLIO_COLLECTION_ID,
      port_slug,
    );

    const portfolio = response;
    const { experience } = portfolio;

    return experience;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function Experience({
  params,
}: {
  params: { port_slug: string };
}) {
  const { port_slug } = params;
  const experience = await fetchExperience(port_slug);

  return <ExperienceForm data={experience} />;
}
