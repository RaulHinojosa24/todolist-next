"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TodoGroupCounts } from "@/lib/definitions"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import EditTodoGroup from "./edit"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Folder, Info, MoreHorizontal, MoreVertical } from "lucide-react"
import DeleteTodoGroup from "./delete"
import { usePathname } from "next/navigation"

export default function TodoGroupItem({
  item,
  isSidebar = false,
}: {
  item: TodoGroupCounts
  isSidebar?: boolean
}) {
  const { id, name, description, completed_count, total_count } = item

  const pathname = usePathname()
  const isActive = pathname === `/tasks/${id}`

  return (
    <>
      {isSidebar ? (
        <SidebarMenuItem key={id}>
          <SidebarMenuButton isActive={isActive} asChild={!isActive}>
            {isActive ? (
              <>
                <Folder />
                <span>{name}</span>
              </>
            ) : (
              <Link href={`/tasks/${id}`}>
                <Folder />
                <span>{name}</span>
              </Link>
            )}
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction showOnHover>
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled>
                <Info className="text-muted-foreground" />
                <span>Info</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <EditTodoGroup todoGroup={item} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <DeleteTodoGroup id={id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      ) : (
        <li>
          <Card className="h-full">
            <CardHeader className="h-full flex flex-col justify-between">
              <div className="flex justify-between items-start gap-2">
                <CardTitle>
                  <Link href={`/tasks/${id}`}>
                    <Button
                      variant={"link"}
                      className="text-start text-base p-0 whitespace-pre-wrap break-all min-h-9 h-auto"
                    >
                      {name}
                    </Button>
                  </Link>
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="p-0">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <EditTodoGroup todoGroup={item} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <DeleteTodoGroup id={id} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>
                <p className="break-all line-clamp-1">
                  {description || "No description"}
                </p>
                {total_count > 0 ? (
                  <p>
                    {completed_count} of {total_count} completed
                  </p>
                ) : (
                  <p>No tasks yet</p>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        </li>
      )}
    </>
  )
}
