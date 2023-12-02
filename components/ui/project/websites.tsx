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

const Icons: { [key: string]: any } = {
  github: LucideGithub,
  gitlab: LucideGithub,
  website: LucideExternalLink,
};

export const ProjectWebsites = ({ websites }: ProjectWebsitesProps) => {
  return (
    <div className="flex flex-row flex-wrap gap-1">
      {websites.map((website) => {
        // const Icon = Icons[extractWebsiteName(website.toLowerCase())];

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="icon" variant="ghost">
                  <a target="_blank" href={website}>
                    {/* {<Icon />} */}
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
  );
};
