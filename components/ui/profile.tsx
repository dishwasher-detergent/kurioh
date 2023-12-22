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
import { auth_service } from "@/lib/appwrite";
import { getInitials } from "@/lib/utils";
import { useProfileStore } from "@/store/zustand";

export const Profile = () => {
  const { profile } = useProfileStore();

  async function handleLogout() {
    await auth_service.signOut();
  }

  return (
    profile && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-12 w-full justify-start gap-2"
          >
            <Avatar className="h-10 w-10">
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
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};
