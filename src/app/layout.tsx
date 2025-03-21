import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import NavBar from "@/components/ui/navbar"
import { ThemeProvider } from "@/components/ui/theme-provider"

const interSans = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "owari: task manager",
  description: "Manage all your tasks easily.",
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
      <body className={`${interSans.className} antialiased flex flex-col `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <main className="grow flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-8">
            {children}
          </main>
          <Toaster position="bottom-center" richColors />
          <footer className="w-full py-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Raul Hinojosa Perez. Licensed under the
            MIT License.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
