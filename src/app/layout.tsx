import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import QueryProviders from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fluxera",
  description: "Smart Manage Tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased h-screen w-screen")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProviders>
            <Toaster position="top-right" richColors />
            {children}
          </QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
