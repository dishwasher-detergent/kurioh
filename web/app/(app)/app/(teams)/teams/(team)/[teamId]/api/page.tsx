import { Request } from "@/components/request";
import { API_ENDPOINT } from "@/lib/constants";
import { getTeamById } from "@/lib/team";
import { notFound } from "next/navigation";

export default async function ApiPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  const endpoint = `${API_ENDPOINT}/organizations/${teamId}`;
  const javascript = `const res = await fetch("${endpoint}");
const data = await res.json();`;
  const model = `interface Organization {
  id: string,
  title: string,
  slug: string,
  information: {
    title: string,
    description: string,
    image_id: string[],
    socials: string[],
  },
  projects: {
    id: string,
    title: string,
    slug: string,
    short_description: string,
    description: string,
    images_ids: string[],
    tags: string[],
    links: string[],
  }[],
  experience: {
    id: string,
    title: string,
    description: string,
    skills: string,
    start_date: Date,
    end_date: Date,
    company: string,
    website: string,
  }[],
}`;

  const org = await getTeamById(teamId);

  if (!org.success) {
    notFound();
  }

  return <Request endpoint={endpoint} code={javascript} model={model} />;
}
