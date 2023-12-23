import "@/app/globals.css";
import { Sidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { auth_service } from "@/lib/appwrite";
import { PROJECT_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { Inter as FontSans } from "next/font/google";
import { cookies } from "next/headers";
import "server-only";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export async function getAccount() {
  const sessionNames = [
    "a_session_" + PROJECT_ID.toLowerCase(),
    "a_session_" + PROJECT_ID.toLowerCase() + "_legacy",
  ];

  const cookieStore = cookies();
  const hash =
    cookieStore.get(sessionNames[0]) ??
    cookieStore.get(sessionNames[1]) ??
    null;
  auth_service.setSession(hash ? hash.value : "");

  let account;
  try {
    account = await auth_service.getAccount();
  } catch (err) {
    account = null;
  }

  return account;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  await getAccount();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "h-screen w-screen overflow-hidden font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex h-full w-full flex-col overflow-hidden bg-slate-50 text-foreground dark:bg-slate-900">
            <div className="flex h-full w-full flex-1 flex-row flex-nowrap">
              <Sidebar />
              <div className="flex h-full flex-1 flex-col">
                <section className="overflow-y-auto overflow-x-hidden p-4">
                  {children}
                </section>
              </div>
            </div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
