"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { deleteTodoItem, updateTodoItemCompleted } from "@/lib/actions"
import type { TodoItem } from "@/lib/definitions"
import { useState } from "react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import EditTodo from "./edit"
import { EllipsisVertical } from "lucide-react"

export default function TodoItem({ item }: { item: TodoItem }) {
  const { id, text, completed } = item

  const [isChecked, setIsChecked] = useState(completed)
  const [isDisabled, setIsDisabled] = useState(false)

  async function checkedChangeHandler() {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    setIsDisabled(true)

    const res = updateTodoItemCompleted.bind(null, id, newChecked)()

    toast.promise(res, {
      loading: "Loading...",
      success: () => {
        return `Task marked as ${newChecked ? "" : "un"}completed.`
      },
      error: (error) => {
        setIsChecked(!newChecked)
        return error.message
      },
      finally: () => {
        setIsDisabled(false)
      },
    })
  }

  async function deleteHandler() {
    const res = deleteTodoItem.bind(null, id)()

    toast.promise(res, {
      loading: "Loading...",
      success: () => {
        return `Task has been deleted.`
      },
      error: (error) => {
        return error.message
      },
    })
  }

  return (
    <li className="items-center flex gap-2">
      <Checkbox
        id={id}
        checked={isChecked}
        onCheckedChange={checkedChangeHandler}
        disabled={isDisabled}
      />
      <Label
        htmlFor={id}
        className={`flex-grow cursor-pointer ${
          isChecked ? "line-through opacity-70" : ""
        }`}
      >
        {text}
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="p-1">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <EditTodo todo={item} />
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete that task.
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
    </li>
  )
}
