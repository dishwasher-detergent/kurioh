import { notFound } from "next/navigation";

import { Request } from "@/components/request";
import { CodeData } from "@/components/ui/code-snippit";
import { API_ENDPOINT } from "@/lib/constants";
import { getTeamById } from "@/lib/team";

export default async function ApiPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  const endpoint = `${API_ENDPOINT}/teams/${teamId}`;
  const javascript: CodeData[] = [
    {
      title: "SDK",
      language: "js",
      code: `import { Client } from "@kurioh/client";

const client = new Client("${API_ENDPOINT}", "${teamId}");
const { data, error, isError, isSuccess, isLoading } = await client.team.get();`,
    },
    {
      title: "JS",
      language: "js",
      code: `const res = await fetch("${endpoint}");
const data = await res.json();`,
    },
  ];
  const model: CodeData[] = [
    {
      title: "JS",
      language: "js",
      code: `interface Team {
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
    title: string,
    description: string,
    skills: string[],
    startDate: Date,
    endDate: Date,
    company: string,
    website: string,
  }[],
  education: {
    school: string,
    fieldOfStudy: string,
    degree: string,
    startDate: Date,
    graduationDate: Date,
  }[],
}`,
    },
  ];

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
