import { Article } from "@/interfaces/article.interface";
import { Experience } from "@/interfaces/experience.interface";
import { Information } from "@/interfaces/information.interface";
import { Project } from "@/interfaces/project.interface";
import { Models } from "appwrite";

export interface Portfolio extends Models.Document {
  title: string;
  information: Information[];
  articles: Article[];
  projects: Project[];
  experience: Experience[];
}
