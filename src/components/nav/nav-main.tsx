import { ClipboardList, Home, LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const routes: {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ClipboardList,
  },
]

export default function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Routes</SidebarGroupLabel>
      <SidebarMenu>
        {routes.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
