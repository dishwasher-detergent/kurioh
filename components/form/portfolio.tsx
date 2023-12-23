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
import { Portfolios } from "@/interfaces/portfolios";
import { auth_service, database_service } from "@/lib/appwrite";
import { PORTFOLIO_COLLECTION_ID } from "@/lib/constants";
import { createSlug } from "@/lib/utils";
import { usePortfolioStore } from "@/store/zustand";
import { zodResolver } from "@hookform/resolvers/zod";
import { Permission, Role } from "appwrite";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1).max(128),
});

export const CreatePortfolioForm = () => {
  const router = useRouter();
  const { update } = usePortfolioStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const slug = createSlug(values.title);

    const portfolio = {
      title: values.title,
    };

    try {
      const user = await auth_service.getAccount();

      const response = await database_service.create<Portfolios>(
        PORTFOLIO_COLLECTION_ID,
        { ...portfolio, creator: user.$id },
        slug,
        [Permission.read(Role.any()), Permission.write(Role.user(user.$id))],
      );

      toast({
        title: "Portfolio Created.",
      });

      update({
        id: response.$id,
        title: response.title,
      });

      router.push(`/${response.$id}`);
    } catch (err) {
      const error = err as Error;

      toast({
        variant: "destructive",
        title: "An error occurred while creating your portfolio.",
        description: error.message,
      });
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Create Portfolio</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Portfolio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-row justify-end gap-2">
            <Button
              disabled={form.formState.isSubmitting}
              type="button"
              variant="destructive"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
