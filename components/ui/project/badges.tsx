import { Badge } from "@/components/ui/badge";

interface ProjectBadgesProps {
  badges: string[];
}

export const ProjectBadges = ({ badges }: ProjectBadgesProps) => {
  return (
    badges && (
      <div className="flex flex-row flex-wrap gap-1">
        {badges.map((badge, index) => (
          <Badge key={index}>{badge}</Badge>
        ))}
      </div>
    )
  );
};
