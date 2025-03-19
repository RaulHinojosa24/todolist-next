import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import NavBar from "@/components/ui/navbar"

const interSans = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Manage all your tasks easily.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${interSans.className} antialiased flex flex-col `}>
        <NavBar />
        <main className="grow flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-8">
          {children}
        </main>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  )
}
