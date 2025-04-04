import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Suspense } from "react"
import { TodoGroupCounts } from "@/lib/definitions"
import TodoGroupItem from "@/components/todo-group/item"
import NewTodoGroup from "@/components/todo-group/new"
import { auth } from "@/auth"

export default async function NavTasks({
  tasks,
}: {
  tasks: Promise<
    | TodoGroupCounts[]
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
                <NewTodoGroup isSidebar />
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
    | TodoGroupCounts[]
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
          <TodoGroupItem key={task.id} item={task} isSidebar />
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
