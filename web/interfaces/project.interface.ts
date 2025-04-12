import { Models } from "node-appwrite";

import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";

export interface Project extends Models.Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  tags: string[];
  links: string[];

  userId: string;
  user?: UserData;
  teamId: string;
  team?: TeamData;
}
