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
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import EditTodoGroup from "./edit"
import { deleteTodoGroup } from "@/lib/actions"
import { toast } from "sonner"

export default function TodoGroupItem({ item }: { item: TodoGroupCounts }) {
  const { id, name, description, completed_count, total_count } = item

  function deleteHandler() {
    const res = deleteTodoGroup.bind(null, id)()

    toast.promise(res, {
      loading: "Loading...",
      success: () => {
        return `Task group has been deleted.`
      },
      error: (error) => {
        return error.message
      },
    })
  }

  return (
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
                <Button variant={"ghost"} className="p-1">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <EditTodoGroup todoGroup={item} />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className="w-full flex items-center justify-start gap-2 px-2 py-1.5 text-sm text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete that task group.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteHandler}>
                          Yes, do it!
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
  )
}
