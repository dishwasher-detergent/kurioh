import { atomWithStorage } from "jotai/utils";

interface Organization {
  id: string;
  title: string;
}

export const organizationIdAtom = atomWithStorage<Organization | null>(
  "ORGANIZATION_ID",
  null,
  undefined,
  {
    getOnInit: true,
  },
);

if (process.env.NODE_ENV !== "production") {
  organizationIdAtom.debugLabel = "Selected Organization";
}
