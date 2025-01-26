import { Organization } from "@/interfaces/organization.interface";
import { atom } from "jotai";

import { atomWithStorage } from "jotai/utils";

interface SelectedOrganization {
  id: string;
  title: string;
}

export const organizationIdAtom = atomWithStorage<SelectedOrganization | null>(
  "ORGANIZATION_ID",
  null,
  undefined,
  {
    getOnInit: true,
  },
);

export const organizationsAtom = atom<Organization[]>([]);

if (process.env.NODE_ENV !== "production") {
  organizationIdAtom.debugLabel = "Selected Organization";
  organizationsAtom.debugLabel = "Organizations";
}
