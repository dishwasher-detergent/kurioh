import { Portfolio } from "@/interfaces/portfolio.interface";
import { Models } from "appwrite";

export interface Experience extends Models.Document {
  company: string;
  website: string;
  title: string;
  description: string;
  languages: string[];
  start: Date;
  end: Date;
  portfolios: Portfolio;
  creator: string;
}
