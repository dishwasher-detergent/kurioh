"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { auth_service } from "@/lib/appwrite";
import { useProfileStore } from "@/store/zustand";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideCheck, LucideLoader2, LucideSend } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

const codeFormSchema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid phone number!"),
});

const codeVerifyFormSchema = z.object({
  secret: z.string().min(6).max(6),
});

export default function Auth() {
  const [smsSent, setSmsSent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { update } = useProfileStore();

  const codeForm = useForm<z.infer<typeof codeFormSchema>>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  async function onCodeSubmit(values: z.infer<typeof codeFormSchema>) {
    try {
      const response = await auth_service.createPhoneSession(values.phone);

      toast({
        title: "Code send!",
      });

      setUserId(response.userId);
      setSmsSent(true);
    } catch (err) {
      const error = err as Error;

      toast({
        variant: "destructive",
        title: "An error occurred while sending your code.",
        description: error.message,
      });
    }
  }

  const codeVerifyForm = useForm<z.infer<typeof codeVerifyFormSchema>>({
    resolver: zodResolver(codeVerifyFormSchema),
    defaultValues: {
      secret: "",
    },
  });

  async function onCodeVerifySubmit(
    values: z.infer<typeof codeVerifyFormSchema>,
  ) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "PUT",
        body: `{ "userId": "${userId}", "secret": "${values.secret}" }`,
      });

      if (!response.ok) {
        throw new Error("Code verification failed!");
      }

      const user = await auth_service.getAccount();

      update({
        id: user.$id,
        name: user.name,
        email: user.email,
      });

      toast({
        title: "Code Verified!",
      });
    } catch (err) {
      const error = err as Error;

      toast({
        variant: "destructive",
        title: "An error occurred while verifying your code.",
        description: error.message,
      });
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{smsSent ? "Verify Code" : "Log In"}</CardTitle>
      </CardHeader>
      <Form {...codeVerifyForm}>
        <form onSubmit={codeVerifyForm.handleSubmit(onCodeVerifySubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={codeVerifyForm.control}
              name="secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-row justify-end gap-2">
            <Button
              type="submit"
              disabled={codeVerifyForm.formState.isSubmitting}
            >
              {codeVerifyForm.formState.isSubmitting ? (
                <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LucideCheck className="mr-2 h-4 w-4" />
              )}
              Verify Code
            </Button>
          </CardFooter>
        </form>
      </Form>
      <Form {...codeForm}>
        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={codeForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1405888888" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-row justify-end gap-2">
            <Button type="submit" disabled={codeForm.formState.isSubmitting}>
              {codeForm.formState.isSubmitting ? (
                <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LucideSend className="mr-2 h-4 w-4" />
              )}
              Send Code
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
