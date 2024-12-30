import { Models } from "appwrite";

export interface Experience extends Models.Document {
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  company: string;
  website: URL;
  skills: string[];
  createdBy: string;
  organization_id: string;
}
