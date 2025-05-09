import { Models } from "node-appwrite";

import { UserData, UserMemberData } from "@/interfaces/user.interface";

export interface TeamData extends Models.Document {
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

export interface Team extends Models.Team<Models.Preferences>, TeamData {}
