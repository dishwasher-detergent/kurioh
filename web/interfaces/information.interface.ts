import { Models } from "node-appwrite";

import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";

export interface Information extends Models.Document {
  title: string;
  description: string;
  image_id: string;
  socials: string[];

  userId: string;
  user?: UserData;
  teamId: string;
  team?: TeamData;
}

export interface Social {
  url: string;
  value: string;
}
