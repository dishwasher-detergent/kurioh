import { Nav } from "@/components/ui/nav";
import { getLoggedInUser } from "@/lib/server/appwrite";

import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Nav />
      {children}
    </>
  );
}
