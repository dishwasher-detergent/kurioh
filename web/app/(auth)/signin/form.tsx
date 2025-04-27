"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideGithub, LucideLoader2, LucideLogIn } from "lucide-react";
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { signInWithEmail, signUpWithGithub } from "@/lib/auth";
import { signInSchema, type SignInFormData } from "@/lib/auth/schemas";

export function SignInForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInFormData>({
    mode: "onChange",
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormData) {
    const result = await signInWithEmail(values);
    toast.error(result.message);
  }

  async function onGithubSignIn() {
    setLoading(true);
    await signUpWithGithub();
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="user@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Password" />
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
                Signing in
                <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
              </>
            ) : (
              <>
                Sign In
                <LucideLogIn className="ml-2 size-3.5" />
              </>
            )}
          </Button>
        </form>
      </Form>
      <div className="relative w-full py-2">
        <p className="bg-background text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl px-2 text-sm font-semibold">
          OR
        </p>
        <Separator />
      </div>
      <form className="w-full" action={onGithubSignIn}>
        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={loading}
        >
          Github
          {loading ? (
            <>
              <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
            </>
          ) : (
            <>
              <LucideGithub className="ml-2 size-3.5" />
            </>
          )}
        </Button>
      </form>
    </>
  );
}
