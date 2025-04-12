"use client";

import { LucideLogOut } from "lucide-react";
import { useMemo } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/interfaces/user.interface";
import { logOut } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import { EditProfile } from "./edit-profile";

export function UserInformation({ user }: { user: User }) {
  const initals = useMemo(() => {
    return getInitials(user.name);
  }, [user.name]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-row-reverse items-center gap-2 rounded-lg pr-3 pl-1 md:flex-row md:pr-1 md:pl-3"
        >
          <p className="hiddenmd:block text-sm">Hello, {user.name}</p>
          <Avatar className="size-7 rounded-lg">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {initals}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <EditProfile user={user} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logOut}>
          Logout
          <DropdownMenuShortcut>
            <LucideLogOut className="size-3" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
