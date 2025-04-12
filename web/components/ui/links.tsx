"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { extractWebsiteName, isValidUrl } from "@/lib/utils";
import {
  LucideCodepen,
  LucideExternalLink,
  LucideGitBranch,
  LucideGithub,
  LucideLinkedin,
} from "lucide-react";

interface LinksProps {
  links: string[];
}

const renderSiteIcon = (param: string) => {
  switch (param) {
    case "github":
      return LucideGithub;
    case "gitlab":
      return LucideGithub;
    case "linkedin":
      return LucideLinkedin;
    case "codepen":
      return LucideCodepen;
    case "bitbucket":
      return LucideGitBranch;
    default:
      return LucideExternalLink;
  }
};

export const Links = ({ links }: LinksProps) => {
  return (
    links &&
    links.length > 0 && (
      <div className="flex flex-row flex-wrap gap-1 rounded-lg">
        {links.map((website, index) => {
          if (!isValidUrl(website)) return null;

          const Icon = renderSiteIcon(
            extractWebsiteName(website.toLowerCase()),
          );

          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size="icon" variant="secondary">
                    <a target="_blank" href={website}>
                      {<Icon className="h-4 w-4" />}
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="center" side="bottom">
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
