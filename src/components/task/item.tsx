"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { updateTaskItemCompleted } from "@/lib/actions"
import type { TaskItem } from "@/lib/definitions"
import { useState } from "react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditTask from "./edit"
import { MoreVertical } from "lucide-react"
import DeleteTaskItem from "./delete"

export default function TaskItem({ item }: { item: TaskItem }) {
  const { id, text, completed } = item

  const [isChecked, setIsChecked] = useState(completed)
  const [isDisabled, setIsDisabled] = useState(false)

  async function checkedChangeHandler() {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    setIsDisabled(true)

    const res = updateTaskItemCompleted.bind(null, id, newChecked)()

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
            <EditTask task={item} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <DeleteTaskItem id={id} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
