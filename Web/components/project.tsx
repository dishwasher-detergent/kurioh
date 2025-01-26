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

import { Check, ChevronsUpDown } from "lucide-react";
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

    if (data?.errors) {
      toast.error(data?.errors.message);
    }

    if (data?.data) {
      setProjects(data.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, [organization]);

  return (
    <>
      {projects.length == 0 && !loading ? (
        <div className="flex w-32">
          <CreateProject />
        </div>
      ) : null}
      {loading && <Skeleton className="h-8 min-w-32" />}
      {projects.length > 0 && !loading && (
        <div className="flex flex-col gap-1 md:flex-row">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                onClick={() => setOpen(!open)}
                size="sm"
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                className="text-muted-foreground"
              >
                {projects.find((x) => x.$id == project)?.title ??
                  "Select Project..."}
                <ChevronsUpDown className="ml-2 size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput
                  className="h-8 text-xs"
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
                          router.push(
                            `/organization/${organization}/project/${currentValue}`,
                          );
                        }}
                        className="cursor-pointer text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            project == projectItem?.$id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {projectItem.title}
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
