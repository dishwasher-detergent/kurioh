import { Portfolio } from "@/interfaces/portfolio.interface";
import { Models } from "appwrite";

export interface Project extends Models.Document {
  title: string;
  short_description: string;
  description: string;
  images: string[];
  position: number;
  tags: string[];
  links: string[];
  color: string;
  slug: string;
  portfolios: Portfolio;
}
