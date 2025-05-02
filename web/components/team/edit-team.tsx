"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucidePencil, LucideSave } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { DyanmicDrawer } from "@/components/ui/dynamic-drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TEAM_NAME_MAX_LENGTH } from "@/constants/team.constants";
import { TeamData } from "@/interfaces/team.interface";
import { updateTeam } from "@/lib/team";
import { EditTeamFormData, editTeamSchema } from "@/lib/team/schemas";
import { cn } from "@/lib/utils";

export function EditTeam({ team }: { team: TeamData }) {
  const [open, setOpen] = useState(false);

  return (
    <DyanmicDrawer
      title={`Edit ${team.name}.`}
      description="Make any changes to this team."
      open={open}
      setOpen={setOpen}
      button={
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <LucidePencil className="size-3.5" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      }
    >
      <EditForm setOpen={setOpen} team={team} />
    </DyanmicDrawer>
  );
}

interface FormProps extends React.ComponentProps<"form"> {
  setOpen: (e: boolean) => void;
  team: TeamData;
}

function EditForm({ className, setOpen, team }: FormProps) {
  const router = useRouter();

  const form = useForm<EditTeamFormData>({
    mode: "onChange",
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      name: team.name,
    },
  });

  async function onSubmit(values: EditTeamFormData) {
    toast.promise(updateTeam({ id: team.$id, data: values }), {
      loading: "Updating team...",
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
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "flex h-full flex-col gap-4 overflow-hidden p-4 md:p-0",
          className,
        )}
      >
        <div className="flex-1 space-y-4 overflow-auto p-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Name your project."
                      className="truncate pr-20"
                      maxLength={TEAM_NAME_MAX_LENGTH}
                    />
                    <Badge
                      className="absolute top-1/2 right-1.5 -translate-y-1/2"
                      variant="secondary"
                    >
                      {field?.value?.length || 0}/{TEAM_NAME_MAX_LENGTH}
                    </Badge>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={
            form.formState.isSubmitting ||
            !form.formState.isValid ||
            !form.formState.isDirty
          }
        >
          Save Team
          {form.formState.isSubmitting ? (
            <LucideLoader2 className="size-3.5 animate-spin" />
          ) : (
            <LucideSave className="size-3.5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
