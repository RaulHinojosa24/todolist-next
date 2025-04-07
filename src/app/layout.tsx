import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import NavBar from "@/components/ui/navbar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/nav/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BreadcrumbProvider } from "@/context/breadcrumb-context"

const interSans = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "owari: task manager",
  creator: "Raul Hinojosa Perez",
  authors: [
    {
      name: "Raul Hinojosa Perez",
      url: "https://raulhinojosa.vercel.app/",
    },
  ],
  description:
    "Owari is a task manager application that helps you manage all your tasks easily and efficiently.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://owari.vercel.app",
    siteName: "owari",
    title: "owari: task manager",
    description:
      "Owari is a task manager application that helps you manage all your tasks easily and efficiently.",
    images: [
      {
        url: "https://owari.vercel.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Owari is a task manager application that helps you manage all your tasks easily and efficiently.",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Owari" />
      </head>
      <body className={`${interSans.className} antialiased`}>
        <SidebarProvider>
          <TooltipProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <BreadcrumbProvider>
                <AppSidebar />
                <div className="grow flex flex-col">
                  <NavBar />
                  <main className="grow flex flex-col w-full max-w-4xl mx-auto space-y-6 overflow-hidden">
                    {children}
                  </main>
                  <Toaster position="bottom-center" richColors />
                  <footer className="w-full p-2 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Raul Hinojosa Perez. Licensed
                    under the MIT License.
                  </footer>
                </div>
              </BreadcrumbProvider>
            </ThemeProvider>
          </TooltipProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}
