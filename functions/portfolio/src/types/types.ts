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
  images: string[];
  position: number;
  tags: string[];
  color: string;
  links: string[];
}

export interface Information extends Models.Document {
  title: string;
  description: string;
  icon: string;
  social: string[];
}

export interface Portfolios extends Models.Document {
  title: string;
  slug: string;
  projects: Projects[];
  information: Information[];
  experience: Experience[];
}

export interface Experience extends Models.Document {
  company: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  portfolios: Portfolios;
  creator: string;
  website: string;
  languages: string[];
}

export interface ImagePreview {
  width?: number;
  height?: number;
  gravity?: string;
  quality?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  opacity?: number;
  rotation?: number;
  background?: string;
  output?: string;
}
