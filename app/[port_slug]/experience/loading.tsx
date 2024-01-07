import { ExperienceFormLoading } from "@/components/form/loading/experience";
import { BreadCrumb } from "@/components/ui/breadcrumb";

export default async function ExperienceLoading() {
  return (
    <div className="flex flex-col gap-4">
      <BreadCrumb />
      <nav>
        <h3 className="pb-1 text-3xl font-bold">Experience</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
          All your experience, wrapped up in one place.
        </p>
      </nav>
      <ExperienceFormLoading />
    </div>
  );
}
