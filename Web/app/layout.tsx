import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import { Dev } from "@/providers/jotai-devtools";
import { Noto_Sans_Mono as Font } from "next/font/google";

const font = Font({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} min-h-dvh overflow-x-hidden bg-muted/50 antialiased`}
      >
        {children}
        <Dev />
        <Toaster />
      </body>
    </html>
  );
}
