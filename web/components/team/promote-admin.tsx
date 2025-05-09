"use client";

import { LucideLoader2, LucideShieldUser } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { promoteToAdmin } from "@/lib/team";

interface PromoteMemberAdminProps {
  userId: string;
  teamId: string;
}

export function PromoteMemberAdmin({
  userId,
  teamId,
}: PromoteMemberAdminProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handlePromote() {
    setLoading(true);

    toast.promise(promoteToAdmin(teamId, userId), {
      loading: "Promoting member...",
      success: (data) => {
        if (data.success) {
          router.refresh();
          setOpen(false);
        } else {
          throw new Error(data.message);
        }

        return data.message;
      },
      error: (err) => {
        return err.message;
      },
    });

    setLoading(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          Promote to Admin
          <DropdownMenuShortcut>
            {loading ? (
              <LucideLoader2 className="size-3.5 animate-spin" />
            ) : (
              <LucideShieldUser className="size-3.5" />
            )}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Promote Member To Admin?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to demote this member from admin?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(!open)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handlePromote}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
