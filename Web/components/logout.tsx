import { Button } from "@/components/ui/button";
import { logOut } from "@/lib/server/utils";

import { LucideLogOut } from "lucide-react";

export function Logout() {
  return (
    <Button variant="ghost" size="sm" onClick={logOut}>
      <span className="hidden md:block">Logout</span>
      <LucideLogOut className="size-3.5 md:ml-2" />
    </Button>
  );
}
