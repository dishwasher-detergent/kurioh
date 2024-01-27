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
      title="Experience"
      description="All your experience, wrapped up in one place."
    >
      {children}
    </Header>
  );
}
