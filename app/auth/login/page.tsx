"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useAuth } from "@/hooks/use-auth";
import { auth_service } from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideCheck, LucideLoader2, LucideSend } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  const router = useRouter();
  const [smsSent, setSmsSent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { login } = useAuth();

  const codeForm = useForm<z.infer<typeof codeFormSchema>>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  async function onCodeSubmit(values: z.infer<typeof codeFormSchema>) {
    try {
      const response = await auth_service.createPhoneSession(values.phone);

      toast("Code Sent!");

      setUserId(response.userId);
      setSmsSent(true);
    } catch (err) {
      toast.error("An error occurred while sending your code.");
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
    await login(userId!, values.secret);

    router.push("/");
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="mb-4 border-b">
        <h1 className="mb-4 flex items-center gap-2 text-xl font-bold">
          PortiCMS
        </h1>
        <CardTitle className="text-lg">Sign In</CardTitle>
        <CardDescription>
          {smsSent
            ? "Enter the code sent to your phone number."
            : "Enter your phone number to receive a code."}
        </CardDescription>
      </CardHeader>
      {smsSent ? (
        <Form {...codeVerifyForm}>
          <form onSubmit={codeVerifyForm.handleSubmit(onCodeVerifySubmit)}>
            <CardContent className="space-y-4">
              <FormField
                key="secret"
                control={codeVerifyForm.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        autoComplete="one-time-code"
                        {...field}
                      />
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
      ) : (
        <Form {...codeForm}>
          <form onSubmit={codeForm.handleSubmit(onCodeSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                key="phone"
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
      )}
    </Card>
  );
}
