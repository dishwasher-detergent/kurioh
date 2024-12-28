import { organizationIdAtom } from "@/atoms/organization";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteOrganization } from "@/lib/utils";
import { useAtom } from "jotai";

import {
  LucideEdit,
  LucideEllipsisVertical,
  LucideLoader2,
  LucideTrash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrganizationSettings() {
  const [organizationId, setOrganizationId] = useAtom(organizationIdAtom);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDeleteOrganization() {
    setLoading(true);

    await deleteOrganization(organizationId?.id);

    setOrganizationId(null);
    setLoading(false);
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary" className="size-8">
          <LucideEllipsisVertical className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="bottom" align="end">
        <DropdownMenuLabel>Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`${organizationId?.id}/edit`}>
              <LucideEdit />
              Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <Button
            size="sm"
            onClick={handleDeleteOrganization}
            variant="destructive"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
            ) : (
              <LucideTrash className="mr-2 size-3.5" />
            )}
            Delete Org
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
