import { Organization } from "@/components/organization";
import { Project } from "@/components/project";

export function Nav() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-row items-center gap-2 p-4 md:px-8">
        <Organization />
        /
        <Project />
      </div>
    </header>
  );
}
