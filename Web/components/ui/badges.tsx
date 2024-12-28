"use client";

import { Badge } from "./badge";

interface BadgesProps {
  badges: string[];
}

export const Badges = ({ badges }: BadgesProps) => {
  return (
    badges &&
    badges.length > 0 && (
      <div className="flex flex-row flex-wrap gap-1 rounded-lg">
        {badges.map((website, index) => {
          return (
            <Badge key={index} variant="secondary">
              {website}
            </Badge>
          );
        })}
      </div>
    )
  );
};
