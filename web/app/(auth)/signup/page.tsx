import { redirect } from "next/navigation";

import { SignUpFooter } from "@/components/signup-footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth/server";
import { SignUpForm } from "./form";

export default async function SignUpPage() {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    redirect("/app");
  }

  return (
    <Card className="bg-background w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome!</CardTitle>
        <CardDescription>
          Enter your email below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignUpForm />
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <SignUpFooter />
      </CardFooter>
    </Card>
  );
}
