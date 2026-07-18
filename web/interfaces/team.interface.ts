import { UserData, UserMemberData } from "@/interfaces/user.interface";

export interface TeamData {
  $id: string;
  name: string;
  members?: UserMemberData[];
  title: string;
  description: string;
  image: string;
  favicon: string;
  socials: string[];
  skills: string[];

  userId: string;
  user?: UserData;
}
