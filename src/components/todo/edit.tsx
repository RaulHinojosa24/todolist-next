"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import TodoForm from "./form"
import { TodoItem } from "@/lib/definitions"
import { Edit } from "lucide-react"

export default function EditTodo({ todo }: { todo: TodoItem }) {
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"dropdown"}>
          <Edit />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Editing Task</DialogTitle>
          <DialogDescription>What would do like to achieve?</DialogDescription>
        </DialogHeader>
        <TodoForm close={handleClose} data={todo} />
      </DialogContent>
    </Dialog>
  )
}
