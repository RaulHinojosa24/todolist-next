"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import TodoGroupForm from "./form"
import { TodoGroup } from "@/lib/definitions"

export default function EditTodoGroup({ todoGroup }: { todoGroup: TodoGroup }) {
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full flex items-center justify-start gap-2 px-2 py-1.5 text-sm"
          variant={"ghost"}
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Creating a New Task Group</DialogTitle>
          <DialogDescription>
            What kind of tasks are you planning to do?
          </DialogDescription>
        </DialogHeader>
        <TodoGroupForm close={handleClose} todoGroup={todoGroup} />
      </DialogContent>
    </Dialog>
  )
}
