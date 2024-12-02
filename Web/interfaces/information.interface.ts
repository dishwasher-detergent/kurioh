import { Models } from "appwrite";

export interface Information extends Models.Document {
  title: string;
  description: string;
  icon: string;
  social: Social[] | string[];
}

export interface Social {
  url: string;
  value: string;
}
