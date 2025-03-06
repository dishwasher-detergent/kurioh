"use client";

import { CreateProject } from "@/components/create-project";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Project as ProjectInterface } from "@/interfaces/project.interface";
import { getProjects } from "@/lib/server/utils";
import { cn } from "@/lib/utils";

import { Check, ChevronsUpDown, LucideLoader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Project() {
  const router = useRouter();
  const { organization, project } = useParams<{
    organization: string;
    project: string;
  }>();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectInterface[]>([]);

  async function fetchProjects() {
    setLoading(true);

    const data = await getProjects(organization);

    if (!data.success) {
      toast.error(data.message);
    }

    if (data?.data) {
      setProjects(data.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, [organization, project]);

  return (
    <>
      {projects.length == 0 && !loading ? (
        <div className="flex w-32">
          <CreateProject />
        </div>
      ) : null}
      {projects.length > 0 && (
        <div className="flex flex-col gap-1 md:flex-row">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                onClick={() => setOpen(!open)}
                size="sm"
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                className="text-muted-foreground max-w-48"
                disabled={loading}
              >
                <span className="truncate">
                  {projects.find((x) => x.$id == project)?.title ??
                    "Select Project..."}
                </span>
                {loading && (
                  <LucideLoader2 className="ml-2 size-4 animate-spin" />
                )}
                <ChevronsUpDown className="ml-2 size-4 flex-none" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput
                  className="h-8 text-sm"
                  placeholder="Search project..."
                />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>
                  <CommandGroup>
                    {projects.map((projectItem) => (
                      <CommandItem
                        key={projectItem.$id}
                        value={projectItem.$id}
                        onSelect={(currentValue) => {
                          setOpen(false);
                        }}
                        className="cursor-pointer text-sm"
                        asChild
                      >
                        <Link
                          href={`/organization/${organization}/project/${projectItem.$id}`}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 flex-none",
                              project == projectItem?.$id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span className="truncate">{projectItem.title}</span>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="flex border-t p-1 md:justify-start">
                <CreateProject />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
}
