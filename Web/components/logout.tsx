"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/server/utils";
import { LucideLoader2, LucideLogOut } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function Logout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOutFunc() {
    setLoading(true);

    try {
      await signOut();

      toast.success("Signed out successfully");
      router.push("/login");
    } catch {
      setLoading(false);
      toast.error("Failed to sign out");
    }
  }

  return (
    <Button variant="ghost" onClick={signOutFunc} disabled={loading}>
      {loading && <LucideLoader2 className="mr-2 size-3.5 animate-spin" />}
      <span className="hidden md:block">Logout</span>
      <LucideLogOut className="size-3.5 md:ml-2" />
    </Button>
  );
}
