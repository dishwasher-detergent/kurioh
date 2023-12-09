import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Profile = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-12 w-full justify-start gap-2"
        >
          <Avatar className="h-10 w-10">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <p className="grid h-full w-full place-items-center bg-slate-950 text-white">
              KB
            </p>
            <AvatarFallback>KB</AvatarFallback>
          </Avatar>
          <p className="truncate">Kenneth Bass</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
