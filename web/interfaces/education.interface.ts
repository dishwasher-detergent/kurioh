import { Models } from "node-appwrite";

import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";

export interface Education extends Models.Document {
  school: string;
  major: string;
  degree: string;
  start_date: Date;
  end_date: Date;

  userId: string;
  user?: UserData;
  teamId: string;
  team?: TeamData;
}
