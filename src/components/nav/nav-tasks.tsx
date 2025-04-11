import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Suspense } from "react"
import { TaskGroupCounts } from "@/lib/definitions"
import TaskGroupItem from "@/components/task-group/item"
import NewTaskGroup from "@/components/task-group/new"
import { auth } from "@/auth"

export default async function NavTasks({
  tasks,
}: {
  tasks: Promise<
    | TaskGroupCounts[]
    | {
        message: string
      }
  >
}) {
  const session = await auth()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Tasks</SidebarGroupLabel>
      <SidebarMenu>
        {session?.user?.id ? (
          <>
            <Suspense
              fallback={
                <SidebarMenuItem className="animate-pulse">
                  <SidebarMenuButton
                    className="text-sidebar-foreground/70"
                    disabled
                  >
                    <span>Loading...</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              }
            >
              <NavAsyncTasks tasks={tasks} />
            </Suspense>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NewTaskGroup isSidebar />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span>Login to view tasks</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

async function NavAsyncTasks({
  tasks,
}: {
  tasks: Promise<
    | TaskGroupCounts[]
    | {
        message: string
      }
  >
}) {
  const fetchedTasks = await tasks

  return (
    <>
      {Array.isArray(fetchedTasks) ? (
        fetchedTasks.map((task) => (
          <TaskGroupItem key={task.id} item={task} isSidebar />
        ))
      ) : (
        <SidebarMenuItem>
          <SidebarMenuButton disabled>
            <span>{fetchedTasks.message}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </>
  )
}
