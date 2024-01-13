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

export default async function Portfolio({
  params,
}: {
  params: { port_slug: string };
}) {
  const { port_slug } = params;
  const experience = await fetchExperience(port_slug);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <nav>
        <h3 className="pb-1 text-3xl font-bold">Experience</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          All your experience, wrapped up in one place.
        </p>
      </nav>
      <ExperienceForm data={experience} />
    </div>
  );
}
