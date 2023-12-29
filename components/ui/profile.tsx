import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { auth_service } from "@/lib/appwrite";
import { getInitials } from "@/lib/utils";
import { useProfileStore } from "@/store/zustand";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Profile = () => {
  const router = useRouter();
  const { logout, profile } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  useEffect(() => {
    useProfileStore.persist.rehydrate();
  }, []);

  return profile ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-12 w-full justify-start gap-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={auth_service.getAccountPicture(profile.name)} />
            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <p className="truncate">{profile.name}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button onClick={() => handleLogout()}>Logout</button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ModeToggle />
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button variant="ghost" className="flex h-12 w-full justify-start gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback>NB</AvatarFallback>
      </Avatar>
      <p className="truncate">Nobody</p>
    </Button>
  );
};
