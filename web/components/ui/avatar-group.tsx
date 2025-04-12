import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserData } from "@/interfaces/user.interface";
import { getInitials } from "@/lib/utils";

interface AvatarGroupProps<T extends UserData> {
  users?: T[];
}

export function AvatarGroup<T extends UserData>({
  users,
}: AvatarGroupProps<T>) {
  return (
    <ul className="flex flex-wrap gap-2 -space-x-6 hover:-space-x-2">
      {users?.map((user) => (
        <li key={user.$id}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="border-background size-10 border-2">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      ))}
    </ul>
  );
}
