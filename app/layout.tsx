import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/common/theme-provider";
import NavBar from "@/components/common/NavBar";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import Transition from "./template";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata = {
  title: "Photospot",
  description: "photospot webapp",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <main className="h-screen bg-background flex flex-col items-center max-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme={"light"}
            disableTransitionOnChange
          >
            <NavBar />
            {children}
            <Toaster />
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
