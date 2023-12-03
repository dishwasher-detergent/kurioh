import { BreadCrumb } from "@/components/ui/breadcrumb";

export const Nav = () => {
  return (
    <nav className="flex h-16 w-full flex-row flex-nowrap items-center gap-2 border-b p-5">
      <BreadCrumb />
    </nav>
  );
};
