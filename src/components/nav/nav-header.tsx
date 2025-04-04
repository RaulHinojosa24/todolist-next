"use client"

import * as React from "react"
import Logo from "@/components/assets/Logo"
import { Hina_Mincho } from "next/font/google"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Link from "next/link"

const hinaMincho = Hina_Mincho({
  weight: "400",
  subsets: ["latin"],
})

export default function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link href="/">
            <div>
              <Logo className="aspect-square size-8" />
            </div>
            <div className={cn(hinaMincho.className, "text-xl")}>Owari</div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
