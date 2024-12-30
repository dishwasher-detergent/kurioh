import { Models } from "appwrite";

export interface Organization extends Models.Document {
  title: string;
  slug: string;
  information_id: string;
  project_ids: string[];
  experience_id: string | null;
  createdBy: string;
}
