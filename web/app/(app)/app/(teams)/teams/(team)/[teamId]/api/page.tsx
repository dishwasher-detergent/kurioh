import { notFound } from "next/navigation";

import { Request } from "@/components/request";
import { API_ENDPOINT } from "@/lib/constants";
import { getTeamById } from "@/lib/team";

export default async function ApiPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  const endpoint = `${API_ENDPOINT}/teams/${teamId}`;
  const javascript = `const res = await fetch("${endpoint}");
const data = await res.json();`;
  const model = `interface Team {
  id: string,
  name: string,
  title: string,
  description: string,
  images: string[],
  socials: string[],
  projects: {
    id: string,
    title: string,
    shortDescription: string,
    description: string,
    images: string[],
    tags: string[],
    links: string[],
  }[],
  experience: {
    id: string,
    title: string,
    description: string,
    skills: string[],
    startDate: Date,
    endDate: Date,
    company: string,
    website: string,
  }[],
}`;

  const org = await getTeamById(teamId);

  if (!org.success) {
    notFound();
  }

  return (
    <Request endpoint={endpoint} code={javascript} model={model}>
      <p className="text-lg font-bold">Fetch Portfolio</p>
      <p className="text-muted-foreground text-sm">
        Fetch a complete portfolio with one simple API call. Includes projects,
        experience, and more.
      </p>
    </Request>
  );
}
