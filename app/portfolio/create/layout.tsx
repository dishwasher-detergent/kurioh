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
      title="Create Your Portfolio!"
      description="The best place to store all your information."
    >
      {children}
    </Header>
  );
}
