"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { extractWebsiteName } from "@/lib/utils";
import { LucideExternalLink, LucideGithub } from "lucide-react";

interface ProjectWebsitesProps {
  websites: string[];
}

const renderSiteIcon = (param: string) => {
  switch (param) {
    case "github":
      return LucideGithub;
    case "gitlab":
      return LucideGithub;
    default:
      return LucideExternalLink;
  }
};

export const ProjectWebsites = ({ websites }: ProjectWebsitesProps) => {
  return (
    websites && (
      <div className="flex flex-row flex-wrap gap-1">
        {websites.map((website, index) => {
          const Icon = renderSiteIcon(
            extractWebsiteName(website.toLowerCase()),
          );

          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size="icon" variant="ghost">
                    <a target="_blank" href={website}>
                      {<Icon className="h-4 w-4" />}
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">{extractWebsiteName(website)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    )
  );
};
