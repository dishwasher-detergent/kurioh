"use client";

import { LucideLoader2, LucideUserMinus } from "lucide-react";
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
import { removeMember } from "@/lib/team";

interface RemoveTeamMemberProps {
  userId: string;
  teamId: string;
}

export function RemoveTeamMember({ userId, teamId }: RemoveTeamMemberProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleRemove() {
    setLoading(true);

    toast.promise(removeMember(teamId, userId), {
      loading: "Removing member...",
      success: (data) => {
        if (data.success) {
          router.refresh();
          setOpen(false);
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
          Remove
          <DropdownMenuShortcut>
            {loading ? (
              <LucideLoader2 className="size-3.5 animate-spin" />
            ) : (
              <LucideUserMinus className="size-3.5" />
            )}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove team member?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(!open)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
