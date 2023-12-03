import "@/app/globals.css";
import { Nav } from "@/components/ui/nav";
import { Sidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "h-screen w-screen overflow-hidden  font-sans  antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex h-full w-full flex-col overflow-hidden bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
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
        </ThemeProvider>
      </body>
    </html>
  );
}
