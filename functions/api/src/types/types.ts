export interface Project {
  id: string;
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

export interface Team {
  id: string;
  title: string;
  name: string;
  description: string;
  socials: Social[];
  image: string;
  favicon: string;
  userId: string;
}

export interface Experience {
  id: string;
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

export interface Education {
  id: string;
  institution: string;
  type: string;
  fieldOfStudy: string;
  degree: string;
  start_date: Date;
  end_date: Date;
  userId: string;
  teamId: string;
}
