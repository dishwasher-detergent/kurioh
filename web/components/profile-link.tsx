import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";

interface ProfileLinkProps {
  avatar?: string;
  name?: string;
  href: string;
  className?: string;
}

export function ProfileLink({
  avatar,
  name,
  href,
  className,
}: ProfileLinkProps) {
  return (
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
  );
}
