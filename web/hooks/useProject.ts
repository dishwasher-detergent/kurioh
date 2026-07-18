"use client";

import { useState } from "react";

import { Project } from "@/interfaces/project.interface";

interface Props {
  initialProject: Project;
}

export const useProject = ({ initialProject }: Props) => {
  const [project] = useState<Project>(initialProject);

  return { project, loading: false };
};
