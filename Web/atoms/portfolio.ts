import { atomWithStorage } from "jotai/utils";

export const portfolioIdAtom = atomWithStorage<string | null>(
  "PORTFOLIO_ID",
  null,
  undefined,
  {
    getOnInit: true,
  },
);

if (process.env.NODE_ENV !== "production") {
  portfolioIdAtom.debugLabel = "Selected Portfolio";
}
