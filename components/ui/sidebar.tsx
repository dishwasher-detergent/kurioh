import { Button } from "@/components/ui/button";
import { Profile } from "@/components/ui/profile";
import {
  LucideBookImage,
  LucideFolderOpen,
  LucidePenLine,
  LucidePlus,
  LucideWrench,
} from "lucide-react";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <aside className="flex w-60 flex-col border-r">
      <div className="flex h-16 w-full flex-none flex-row gap-4 px-5">
        <h1 className="flex flex-row items-center gap-4">
          <LucideWrench className="h-4 w-4" />
          CMS
        </h1>
      </div>
      <ul className="flex w-full flex-1 flex-col gap-4 overflow-y-auto p-2">
        <li className="flex w-full flex-row gap-2">
          <Button
            asChild
            variant="ghost"
            className="flex flex-1 flex-row justify-start gap-4"
          >
            <Link href="/portfolio">
              <LucideFolderOpen className="h-4 w-4" />
              Portfolio
            </Link>
          </Button>
        </li>
        <li className="flex w-full flex-row gap-2">
          <Button
            asChild
            variant="ghost"
            className="flex flex-1 flex-row justify-start gap-4"
          >
            <Link href="/projects">
              <LucideBookImage className="h-4 w-4" />
              Projects
            </Link>
          </Button>
          <Button asChild size="icon" variant="secondary">
            <Link href="/projects/create">
              <LucidePlus className="h-4 w-4" />
            </Link>
          </Button>
        </li>
        <li className="flex w-full flex-row gap-2">
          <Button
            asChild
            variant="ghost"
            className="flex flex-1 flex-row justify-start gap-4"
          >
            <Link href="/articles">
              <LucidePenLine className="h-4 w-4" />
              Articles
            </Link>
          </Button>
          <Button asChild size="icon" variant="secondary">
            <Link href="/articles/create">
              <LucidePlus className="h-4 w-4" />
            </Link>
          </Button>
        </li>
      </ul>
      <div className="p-2">
        <Profile />
      </div>
    </aside>
  );
};
