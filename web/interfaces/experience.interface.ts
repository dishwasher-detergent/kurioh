import { Models } from "node-appwrite";

import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";

export interface Experience extends Models.Document {
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  company: string;
  website?: URL;
  skills: string[];

  userId: string;
  user?: UserData;
  teamId: string;
  team?: TeamData;
}
