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
import { Label } from "@/components/ui/label";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Password() {
  const router = useRouter();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | null>(null);
  const [passwordState, setPasswordState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function updatePassword() {
    setLoading(true);
    const { account } = await createClient();

    try {
      if (password && password != "") {
        await account.updatePassword(password);
        await account.deleteSessions();
        router.push(`/login`);
      } else {
        setPasswordState("Missing password value.");
      }
    } catch (err) {
      const error = err as Error;
      setPasswordState(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    async function getEmail() {
      setLoading(true);
      const user = await getLoggedInUser();

      if (!user) {
        router.push("/login");
      }

      setEmail(user?.email);
      setLoading(false);
    }

    getEmail();
  }, []);

  return (
    <Card className="w-full max-w-sm bg-muted/25">
      <CardHeader>
        <CardTitle className="text-2xl">Create Password</CardTitle>
        <CardDescription>
          Finish setting up your account by adding a password.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePassword();
        }}
      >
        <CardContent className="grid gap-4">
          {passwordState ? (
            <p className="w-full overflow-hidden rounded-xl border border-dashed border-destructive p-4 text-xs font-bold text-destructive">
              {passwordState}
            </p>
          ) : null}
          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label>Email</Label>
              {email ? (
                <p className="font-bold">{email}</p>
              ) : (
                <Skeleton className="h-9 w-full" />
              )}
            </div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              name="password"
              placeholder="Password"
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading && (
              <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
            )}
            Create Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
