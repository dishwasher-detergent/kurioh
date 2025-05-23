"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucideMail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createPasswordRecovery } from "@/lib/auth";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/auth/schemas";

export function RecoverForm() {
  const form = useForm<ResetPasswordFormData>({
    mode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormData) {
    const result = await createPasswordRecovery(values);
    toast.error(result.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="user@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? (
            <>
              Sending Reset Link
              <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
            </>
          ) : (
            <>
              Send Reset Link
              <LucideMail className="ml-2 size-3.5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
