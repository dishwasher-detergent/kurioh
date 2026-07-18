"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import { getLoggedInUser, SessionUser } from "@/lib/auth";

interface SessionContextType {
  user: SessionUser | null;
  loading: boolean;
  setUser: (user: SessionUser | null) => void;
  refreshUser: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined,
);

export function SessionProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: SessionUser | null;
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const [loading, setLoading] = useState(initialUser === null);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const response = await getLoggedInUser();
      setUser(response);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUser) {
      setLoading(false);
      return;
    }

    refreshUser();
  }, [initialUser]);

  return (
    <SessionContext.Provider value={{ user, loading, setUser, refreshUser }}>
      {children}
    </SessionContext.Provider>
  );
}
