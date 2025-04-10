import { AddProject } from "@/components/project/create-project";
import { Projects } from "@/components/realtime/projects";
import { CreateTeam } from "@/components/team/create-team";
import { listProjects } from "@/lib/db";
import { listTeams } from "@/lib/team";
import { Query } from "node-appwrite";

export default async function AppPage() {
  const { data } = await listProjects([Query.orderDesc("$createdAt")]);
  const { data: teams } = await listTeams();

  return teams && teams?.length > 0 ? (
    <>
      <header className="flex flex-row justify-between items-center pb-4 w-full">
        <h2 className="font-bold">Projects</h2>
        <AddProject teams={teams} />
      </header>
      <Projects initialProjects={data?.documents} />
    </>
  ) : (
    <section className="grid place-items-center gap-4">
      <p className="text-lg font-semibold text-center">
        Looks like you&apos;re apart of no teams yet, <br />
        join one or create one to get started!
      </p>
      <CreateTeam />
    </section>
  );
}
