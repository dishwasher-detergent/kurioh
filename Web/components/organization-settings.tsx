"use client";

import { organizationIdAtom, organizationsAtom } from "@/atoms/organization";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteOrganization } from "@/lib/utils";
import { useAtom, useSetAtom } from "jotai";

import {
  LucideEllipsisVertical,
  LucideLoader2,
  LucideTrash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function OrganizationSettings() {
  const [organizationId, setOrganizationId] = useAtom(organizationIdAtom);
  const setOrganizations = useSetAtom(organizationsAtom);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDeleteOrganization() {
    setLoading(true);

    const promise = async () => {
      const data = await deleteOrganization(organizationId?.id);
      setOrganizations(data?.documents ?? []);
      setOrganizationId(null);
      setLoading(false);
      router.push(`/organization/${data?.documents[0]?.id}`);
    };

    toast.promise(promise, {
      loading: "Deleting organization...",
      success: "Organization deleted successfully!",
      error: "Failed to delete organization!",
    });
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
