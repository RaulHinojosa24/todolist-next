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
import { UUID } from "crypto"

export default function NewTodo({ todoGroupId }: { todoGroupId: UUID }) {
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">+ new task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Creating a New Task</DialogTitle>
          <DialogDescription>What would do like to achieve?</DialogDescription>
        </DialogHeader>
        <TodoForm close={handleClose} data={todoGroupId} />
      </DialogContent>
    </Dialog>
  )
}
