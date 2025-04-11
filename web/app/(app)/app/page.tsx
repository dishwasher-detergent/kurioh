import { redirect } from "next/navigation";

import { CreateTeam } from "@/components/team/create-team";
import { getLoggedInUser } from "@/lib/auth";
import { listTeams } from "@/lib/team";

export default async function Home() {
  const user = await getLoggedInUser();

  if (!user) {
    redirect("/login");
  }

  if (user.prefs.lastVisitedTeam) {
    redirect(`/app/teams/${user.prefs.lastVisitedTeam}`);
  } else {
    const orgs = await listTeams();

    if (orgs.data && orgs.data.length > 0) {
      redirect(`/app/teams/${orgs.data[0].$id}`);
    }
  }

  return (
    <main className="mx-auto grid h-full min-h-dvh max-w-6xl place-items-center space-y-4 p-4 px-4 md:px-8">
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <h1 className="text-xl font-bold">
          Looks like you don&apos;t have any teams created yet.
        </h1>
        <p>Lets get started!</p>
        <div>
          <CreateTeam />
        </div>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
