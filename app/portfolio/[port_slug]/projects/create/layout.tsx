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
      title="Create a Project"
      description="Show off what you've been working on!"
    >
      {children}
    </Header>
  );
}
