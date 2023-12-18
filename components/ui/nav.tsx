import { Button } from "@/components/ui/button";
import { PortfoliosSelect } from "@/components/ui/portfolios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucidePlus } from "lucide-react";
import Link from "next/link";

export const Nav = () => {
  return (
    <nav className="flex h-16 w-full flex-none flex-row flex-nowrap items-center gap-2 px-4">
      <ul>
        <li className="flex w-full flex-row gap-2">
          <PortfoliosSelect />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="icon" variant="outline">
                  <Link href={`/portfolio/create`} className="flex-none">
                    <LucidePlus className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="capitalize">Create a portfolio.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      </ul>
    </nav>
  );
};
