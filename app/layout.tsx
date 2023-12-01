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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "bg-background h-screen w-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <main className="flex h-full w-full flex-col overflow-hidden">
          <div className="flex w-full flex-1 flex-row flex-nowrap">
            <Sidebar />
            <div className="flex-1">
              <Nav />
              <section className="p-5">{children}</section>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
