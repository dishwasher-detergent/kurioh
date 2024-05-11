import { Badge } from "@/components/ui/badge";

interface ProjectBadgesProps {
  badges: string[];
}

export const ProjectBadges = ({ badges }: ProjectBadgesProps) => {
  return (
    badges &&
    badges.length > 0 && (
      <div className="flex flex-row flex-wrap gap-1">
        {badges.map((badge, index) => (
          <Badge key={index} variant="secondary">
            {badge}
          </Badge>
        ))}
      </div>
    )
  );
};
