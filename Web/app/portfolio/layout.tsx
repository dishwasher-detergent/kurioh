"use client";

import "@/app/globals.css";
import { Nav } from "@/components/ui/nav";
import { auth_service } from "@/lib/appwrite";
import { useProfileStore } from "@/store/zustand";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const { update } = useProfileStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await auth_service.getAccount();

        update({
          id: result.$id,
          name: result.name,
          email: result.email,
        });
        setAuth(true);
      } catch (err) {
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <Nav />
      <section className="overflow-x flex flex-1 flex-col overflow-y-auto">
        {auth && children}
      </section>
    </>
  );
}
