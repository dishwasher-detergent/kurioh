import { ImageFormat, ImageGravity, Models } from 'node-appwrite';

export interface Context {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
}

export interface Project extends Models.Document {
  title: string;
  short_description: string;
  description: string;
  image_ids: string[];
  tags: string[];
  links: string[];
  slug: string;
  organization_id: string;
}

export interface Information extends Models.Document {
  title: string;
  description: string;
  image_id: string;
  socials: string[];
  organization_id: string;
  createdBy: string;
}

export interface Social {
  url: string;
  value: string;
}

export interface Organization extends Models.Document {
  title: string;
  slug: string;
  information_id: string;
  project_ids: string[];
  experience_id: string | null;
  createdBy: string;
}

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

export interface ImagePreview {
  width?: number;
  height?: number;
  gravity?: ImageGravity;
  quality?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  opacity?: number;
  rotation?: number;
  background?: string;
  output?: ImageFormat;
}
