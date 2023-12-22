"use client";

import { LucideChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadCrumbProps {
  crumbs?: {
    name: string;
    path: string;
  }[];
}

export const BreadCrumb = ({ crumbs }: BreadCrumbProps) => {
  const pathname = usePathname();

  if (crumbs == undefined) {
    const temp = pathname.split("/");

    crumbs = temp.map((crumb, index) => {
      return {
        name: crumb,
        path: temp.slice(0, index + 1).join("/"),
      };
    });

    crumbs.unshift({
      name: "Home",
      path: "/",
    });
  }

  return (
    <div>
      <ul className="flex flex-row gap-1 pb-4 text-sm">
        {crumbs.map((crumb, index) => {
          return (
            crumb.name != "" && (
              <li key={index}>
                <Link
                  href={crumb.path}
                  className={`${
                    index !== crumbs!.length - 1
                      ? "text-slate-500 dark:text-slate-300"
                      : "font-semibold text-primary"
                  } flex flex-row items-center gap-1 capitalize`}
                >
                  {crumb.name}
                  {index !== (crumbs?.length ?? 0) - 1 && (
                    <LucideChevronRight size={16} />
                  )}
                </Link>
              </li>
            )
          );
        })}
      </ul>
    </div>
  );
};
