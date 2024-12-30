import { Project } from "@/interfaces/project.interface";
import { atomWithStorage } from "jotai/utils";

interface SelectedProject {
  id: string;
  title: string;
}

export const projectIdAtom = atomWithStorage<SelectedProject | null>(
  "PROJECT_ID",
  null,
  undefined,
  {
    getOnInit: true,
  },
);

export const projectsAtom = atomWithStorage<Project[]>(
  "PROJECTS",
  [],
  undefined,
  {
    getOnInit: true,
  },
);

if (process.env.NODE_ENV !== "production") {
  projectIdAtom.debugLabel = "Selected Project";
  projectsAtom.debugLabel = "Projects";
}
