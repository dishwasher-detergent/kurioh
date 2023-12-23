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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ModeToggle } from "./theme-toggle";

export const Profile = () => {
  const router = useRouter();
  const { remove, profile } = useProfileStore();

  async function handleLogout() {
    await auth_service.signOut();
    remove();
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
    <Button asChild className="w-full">
      <Link href="/auth/login">Login</Link>
    </Button>
  );
};
