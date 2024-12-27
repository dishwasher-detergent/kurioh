"use client";

import { organizationIdAtom } from "@/atoms/organization";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn, createOrganization } from "@/lib/utils";

import { useAtom } from "jotai";
import { LucideLoader2, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CreateOrg() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1" variant="outline" size="sm">
            Create Org
            <LucidePlus className="ml-2 size-3.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
          </DialogHeader>
          <Form setOpen={(e: boolean) => setOpen(e)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="flex-1" variant="outline" size="sm">
          Create Org
          <LucidePlus className="ml-2 size-3.5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Organization</DrawerTitle>
        </DrawerHeader>
        <Form className="px-4" setOpen={(e: boolean) => setOpen(e)} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface FormProps extends React.ComponentProps<"form"> {
  setOpen: (e: boolean) => void;
}

function Form({ className, setOpen }: FormProps) {
  const [loadingCreateOrganization, setLoadingCreateOrganization] =
    useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const router = useRouter();
  const [organizationId, setorganizationId] = useAtom(organizationIdAtom);

  async function create() {
    setLoadingCreateOrganization(true);

    if (!name) {
      toast.error("No organization name specified!");
      return;
    }

    const data = await createOrganization(name);

    if (data) {
      setorganizationId({
        title: data.title,
        id: data.$id,
      });
      router.push(`/${data.$id}`);
    }

    setLoadingCreateOrganization(false);
    setOpen(false);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        create();
      }}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="email">Organization Name</Label>
        <Input
          id="email"
          required
          placeholder="Sample Organization"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loadingCreateOrganization}>
        {loadingCreateOrganization ? (
          <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
        ) : (
          <LucidePlus className="mr-2 size-3.5" />
        )}
        Create
      </Button>
    </form>
  );
}
