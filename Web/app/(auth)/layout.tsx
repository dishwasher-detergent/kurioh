import { getLoggedInUser } from "@/lib/server/appwrite";

import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="grid min-h-dvh w-full place-items-center p-4">
      {children}
    </main>
  );
}
