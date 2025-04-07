"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { updateTodoItemCompleted } from "@/lib/actions"
import type { TodoItem } from "@/lib/definitions"
import { useState } from "react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditTodo from "./edit"
import { MoreVertical } from "lucide-react"
import DeleteTodoItem from "./delete"

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
        className={`grow cursor-pointer ${
          isChecked ? "line-through opacity-70" : ""
        }`}
      >
        {text}
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="p-0">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <EditTodo todo={item} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <DeleteTodoItem id={id} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
