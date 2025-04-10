import { UserActions } from "@/components/user/user-actions";
import { UserData } from "@/interfaces/user.interface";

interface UserHeaderProps {
  user: UserData;
  canEdit: boolean;
}

export function UserHeader({ user, canEdit }: UserHeaderProps) {
  return canEdit && <UserActions user={user} />;
}
