"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { createTeam } from "@/lib/team";
import { AddTeamFormData, addTeamSchema } from "@/lib/team/schemas";
import { cn } from "@/lib/utils";

export function CreateTeam({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <DyanmicDrawer
      title="Team Creation"
      description="Create a new Team to house your projects!"
      open={open}
      setOpen={setOpen}
      button={
        <Button className={className}>
          Create Team
          <LucidePlus className="ml-2 size-3.5" />
        </Button>
      }
    >
      <CreateForm />
    </DyanmicDrawer>
  );
}

function CreateForm({ className }: React.ComponentProps<"form">) {
  const router = useRouter();

  const form = useForm<AddTeamFormData>({
    mode: "onChange",
    resolver: zodResolver(addTeamSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: AddTeamFormData) {
    toast.promise(
      createTeam({
        data: values,
      }),
      {
        loading: "Creating team...",
        success: (data) => {
          if (data.success) {
            router.push(`/app/teams/${data.data!.$id}`);
          } else {
            throw new Error(data.message);
          }

          return data.message;
        },
        error: (err) => {
          return err.message;
        },
      },
    );
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
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Name your team."
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
          className="sticky bottom-0"
          type="submit"
          disabled={
            form.formState.isSubmitting ||
            !form.formState.isValid ||
            !form.formState.isDirty
          }
        >
          Create Team
          {form.formState.isSubmitting ? (
            <LucideLoader2 className="size-3.5 animate-spin" />
          ) : (
            <LucidePlus className="size-3.5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
