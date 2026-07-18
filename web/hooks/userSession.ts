"use client";

import { useContext } from "react";

import { SessionContext } from "@/providers/session-provider";

export const useSession = () => {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
