import "@/app/globals.css";
import { Nav } from "@/components/ui/nav";
import { Sidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head />
      <body
        className={cn(
          "h-screen w-screen overflow-hidden bg-white font-sans text-slate-950 antialiased dark:bg-slate-950 dark:text-white",
          fontSans.variable,
        )}
      >
        <main className="flex h-full w-full flex-col overflow-hidden">
          <div className="flex h-full w-full flex-1 flex-row flex-nowrap">
            <Sidebar />
            <div className="flex h-full flex-1 flex-col">
              <Nav />
              <section className="overflow-y-auto overflow-x-hidden p-5">
                {children}
              </section>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
