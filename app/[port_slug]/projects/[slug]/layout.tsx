import { Header } from "@/components/ui/header";

interface LayoutProps {
  params: {
    port_slug: string;
    slug: string;
  };
  children: React.ReactNode;
}

export default async function Layout({ params, children }: LayoutProps) {
  return (
    <Header
      title={`Edit ${params.slug}`}
      description="Edit your project to make it even better!"
    >
      {children}
    </Header>
  );
}
