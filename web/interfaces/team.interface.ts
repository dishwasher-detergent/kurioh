import { Models } from "node-appwrite";

import { UserData, UserMemberData } from "@/interfaces/user.interface";

export interface TeamData extends Models.Document {
  name: string;
  members?: UserMemberData[];
  title: string;
  description: string;
  image: string;
  socials: string[];

  userId: string;
  user?: UserData;
}

export interface Team extends Models.Team<Models.Preferences>, TeamData {}
