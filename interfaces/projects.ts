import { Portfolios } from "@/interfaces/portfolios";
import { Models } from "appwrite";

export interface Projects extends Models.Document {
  title: string;
  short_description: string;
  description: string;
  images: string[];
  position: number;
  tags: string[];
  links: string[];
  color: string;
  slug: string;
  portfolios: Portfolios;
}
