import type React from "react"
import { Inter } from "next/font/google"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/main-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <MainSidebar />
            <SidebarInset>
              <div className="flex min-h-screen flex-col">
                <header className="border-b bg-background">
                  <div className="container flex h-14 items-center px-4">
                    <SidebarTrigger />
                    <div className="ml-4 font-semibold">Car Finder Assistant</div>
                  </div>
                </header>
                <main className="flex-1">{children}</main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
