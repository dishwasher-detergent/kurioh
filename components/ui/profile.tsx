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
      <DropdownMenuTrigger className="flex flex-row items-center gap-2 md:w-36">
        <>
          <Avatar className="h-8 w-8">
            <AvatarImage src={auth_service.getAccountPicture(profile.name)} />
            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <p className="hidden truncate text-sm font-semibold md:block">
            {profile.name}
          </p>
        </>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
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
