"use client";

import { LucideCheck, LucideClipboard } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function CopyToClipboard({
  data,
  className,
}: {
  data: string | object;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string, setter: (value: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className={cn("text-xs", className)}
            onClick={() =>
              copyToClipboard(
                typeof data === "string" ? data : JSON.stringify(data, null, 2),
                setCopied,
              )
            }
          >
            {copied ? (
              <>
                Copied
                <LucideCheck className="size-3" />
              </>
            ) : (
              <>
                Copy
                <LucideClipboard className="size-3" />
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Copy response"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
