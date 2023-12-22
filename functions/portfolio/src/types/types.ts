import { Models } from 'node-appwrite';

export interface Context {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
}

export interface Projects extends Models.Document {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image: string[];
  position: number;
  tags: string[];
  color: string;
  links: string[];
}

export interface Portfolios extends Models.Document {
  title: string;
  slug: string;
  projects: Projects[];
}
