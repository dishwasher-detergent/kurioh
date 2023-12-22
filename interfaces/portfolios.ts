import { Articles } from "@/interfaces/articles";
import { Information } from "@/interfaces/information";
import { Projects } from "@/interfaces/projects";
import { Models } from "appwrite";

export interface Portfolios extends Models.Document {
  title: string;
  information: Information[];
  articles: Articles[];
  projects: Projects[];
}
