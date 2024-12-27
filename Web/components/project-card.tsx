import { Project } from "@/interfaces/project.interface";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function ProjectCard({
  $id,
  title,
  short_description,
  tags,
  color,
  images_ids,
  slug,
  organization_id,
}: Project) {
  return (
    <Link href={`/${organization_id}/${$id}`}>
      <Card className="transition-all hover:border-primary hover:ring hover:ring-primary/10">
        <CardHeader className="p-4 pb-3">
          <CardDescription className="text-xs">{slug}</CardDescription>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm">{short_description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
