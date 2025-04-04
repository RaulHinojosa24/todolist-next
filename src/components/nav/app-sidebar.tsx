import NavMain from "@/components/nav/nav-main"
import NavTasks from "@/components/nav/nav-tasks"
import NavUser from "@/components/nav/nav-user"
import NavHeader from "@/components/nav/nav-header"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { fetchTodoGroups } from "@/lib/data"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const tasks = fetchTodoGroups()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavTasks tasks={tasks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
