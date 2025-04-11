import { ProjectSelect } from "@/components/project/project-select";
import { TeamSelect } from "@/components/team/team-select";
import { ModeToggle } from "@/components/theme-toggle";
import { SubNav } from "@/components/ui/sub-nav";
import { UserInformation } from "@/components/user/user-information";
import { getUserData } from "@/lib/auth";

export async function Nav() {
  const { data } = await getUserData();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/90 backdrop-blur-xs">
      <div className="mx-auto flex max-w-6xl flex-col-reverse md:flex-row md:items-center justify-between gap-2 px-4 py-2 md:px-8">
        <div className="flex flex-row items-center gap-2">
          <TeamSelect />
          /
          <ProjectSelect />
        </div>
        <div className="flex flex-row-reverse md:flex-row justify-end items-center gap-2">
          <ModeToggle />
          {data && <UserInformation user={data} />}
        </div>
      </div>
      <SubNav />
    </header>
  );
}
