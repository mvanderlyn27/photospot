import './globals.css'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/common/theme-provider"
import NavBar from '@/components/common/NavBar'
import { createClient } from '@/utils/supabase/server'

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
export const metadata = {
  title: 'Photospot',
  description: 'photospot webapp',
}
export const dynamic = "force-dynamic";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <main className="min-h-screen bg-background flex flex-col items-center">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <NavBar user={user} />
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
