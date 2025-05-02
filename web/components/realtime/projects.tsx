"use client";

import {
  LucideChevronDown,
  LucideGhost,
  LucideLoader2,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MultiCardSkeleton } from "@/components/loading/multi-card-skeleton";
import { ProjectCard } from "@/components/project/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/interfaces/project.interface";

interface ProjectsProps {
  initialProjects?: Project[];
  teamId?: string;
  userId?: string;
}

export function Projects({ initialProjects, teamId, userId }: ProjectsProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(
    undefined,
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { loading, projects, hasMore, totalProjects, nextCursor } = useProjects(
    {
      initialProjects: searchTerm ? undefined : initialProjects,
      teamId,
      userId,
      searchTerm: searchTerm || undefined,
      cursor: currentCursor,
    },
  );

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setSearchTerm(inputValue);
      setCurrentCursor(undefined); // Reset cursor when search term changes
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleLoadMore = () => {
    if (!nextCursor || loading) return;
    setCurrentCursor(nextCursor);
  };

  return (
    <div className="space-y-4">
      <div className="relative md:w-1/3">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search projects by name..."
          value={inputValue}
          onChange={handleSearchChange}
          className="pl-10"
          disabled={loading}
        />
      </div>
      {loading && !currentCursor ? (
        <MultiCardSkeleton />
      ) : (
        <section className="min-h-full columns-xs items-start gap-4 space-y-4">
          {projects?.map((project) => (
            <ProjectCard key={project.$id} {...project} />
          ))}
          {projects?.length === 0 && (
            <p className="text-muted-foreground text-sm">
              {searchTerm
                ? "No projects match your search"
                : "No projects found"}
              <LucideGhost className="ml-2 inline size-4" />
            </p>
          )}
        </section>
      )}
      {projects.length > 0 && (
        <div className="flex flex-col items-center space-y-2 pt-2">
          <p className="text-muted-foreground text-sm">
            Showing {projects.length} of {totalProjects} projects
          </p>
          {hasMore && (
            <Button
              variant="secondary"
              onClick={handleLoadMore}
              disabled={loading || !nextCursor}
            >
              Show More
              {loading ? (
                <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
              ) : (
                <LucideChevronDown className="ml-2 size-3.5" />
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
