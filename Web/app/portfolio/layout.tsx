"use client";

import "@/app/globals.css";
import { Nav } from "@/components/ui/nav";
import { auth_service } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await auth_service.getAccount();
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
