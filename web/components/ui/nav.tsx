import { ProjectSelect } from "@/components/project/project-select";
import { TeamSelect } from "@/components/team/team-select";
import { ModeToggle } from "@/components/theme-toggle";
import { SubNav } from "@/components/ui/sub-nav";
import { UserInformation } from "@/components/user/user-information";
import { getUserData } from "@/lib/auth";

export async function Nav() {
  const { data } = await getUserData();

  return (
    <header className="bg-background/90 sticky top-0 z-10 w-full border-b backdrop-blur-xs">
      <div className="mx-auto flex max-w-6xl flex-col-reverse justify-between gap-2 px-4 py-2 md:flex-row md:items-center md:px-8">
        <div className="flex flex-row items-center gap-2">
          <TeamSelect />
          /
          <ProjectSelect />
        </div>
        <div className="flex flex-row-reverse items-center justify-end gap-2 md:flex-row">
          <ModeToggle />
          {data && <UserInformation user={data} />}
        </div>
      </div>
      <SubNav />
    </header>
  );
}
