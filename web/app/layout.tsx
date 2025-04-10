import type { Metadata } from "next";
import { Karla } from "next/font/google";
import { Toaster } from "sonner";

import { SessionProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio CMS",
  description: "A Portfolio CMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${karla.variable} min-h-dvh overflow-x-hidden antialiased flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <Toaster />
            <div id="modal-root" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
