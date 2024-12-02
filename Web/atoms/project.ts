import { atomWithStorage } from "jotai/utils";

interface Project {
  id: string;
  title: string;
}

export const projectIdAtom = atomWithStorage<Project | null>(
  "PROJECT_ID",
  null,
  undefined,
  {
    getOnInit: true,
  },
);

if (process.env.NODE_ENV !== "production") {
  projectIdAtom.debugLabel = "Selected Project";
}
