import { Portfolios } from "@/interfaces/portfolios";
import { Models } from "appwrite";

export interface Experience extends Models.Document {
  title: string;
  description: string;
  current: boolean;
  start: Date;
  end: Date;
  portfolios: Portfolios;
  creator: string;
}
