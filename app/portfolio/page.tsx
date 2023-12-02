import { InformationForm } from "@/components/form/information";
import { SocialMediaForm } from "@/components/form/social_media";

export default function Portfolio() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold">Portfolio</h3>
      <InformationForm />
      <SocialMediaForm />
    </div>
  );
}
