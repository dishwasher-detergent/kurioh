import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";

interface ProfileLinkProps {
  name?: string;
  href?: string;
  className?: string;
}

export function ProfileLink({ name, href, className }: ProfileLinkProps) {
  return href ? (
    <Button
      variant="link"
      asChild
      className={cn("text-sm text-primary-foreground p-0", className)}
    >
      <Link href={href}>
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        {name || "Unknown"}
      </Link>
    </Button>
  ) : (
    <p
      className={cn(
        "flex flex-row items-center gap-2 text-sm text-primary-foreground font-semibold",
        className
      )}
    >
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-primary">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {name || "Unknown"}
    </p>
  );
}
