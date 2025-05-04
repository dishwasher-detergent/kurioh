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
  images: string[];
  tags: string[];
  links: string[];
  slug: string;
  teamId: string;
}

export interface Social {
  url: string;
  value: string;
}

export interface Team extends Models.Document {
  title: string;
  name: string;
  description: string;
  socials: Social[];
  image: string;
  favicon: string;
  userId: string;
}

export interface Experience extends Models.Document {
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  company: string;
  type: string;
  website: URL;
  skills: string[];
  userId: string;
  teamId: string;
}

export interface Education extends Models.Document {
  institution: string;
  type: string;
  fieldOfStudy: string;
  degree: string;
  start_date: Date;
  end_date: Date;
  userId: string;
  teamId: string;
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
