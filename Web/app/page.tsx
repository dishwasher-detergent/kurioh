import { CreateOrg } from "@/components/create-organization";
import { getLoggedInUser } from "@/lib/server/appwrite";
import { getOrganizations } from "@/lib/server/utils";

import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getLoggedInUser();

  if (!user) {
    console.error("User not logged in, redirecting to login page", user);
    // redirect("/login");
    return;
  }

  if (user.prefs.lastVisitedOrg) {
    redirect(`/organization/${user.prefs.lastVisitedOrg}`);
  } else {
    const orgs = await getOrganizations();

    if (orgs.data && orgs.data.length > 0) {
      redirect(`/organization/${orgs.data[0].$id}`);
    }
  }

  return (
    <main className="mx-auto grid h-full min-h-dvh max-w-6xl place-items-center space-y-4 p-4 px-4 md:px-8">
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <h1 className="text-xl font-bold">
          Looks like you don&apos;t have any orgnaizations created yet.
        </h1>
        <p>Lets get started!</p>
        <div>
          <CreateOrg />
        </div>
      </div>
    </main>
  );
}
