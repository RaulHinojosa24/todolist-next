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
import TaskForm from "./form"
import { UUID } from "crypto"
import { Plus } from "lucide-react"

export default function NewTask({ taskGroupId }: { taskGroupId: UUID }) {
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus />
          <span>new task</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Creating a New Task</DialogTitle>
          <DialogDescription>What would you like to achieve?</DialogDescription>
        </DialogHeader>
        <TaskForm close={handleClose} data={taskGroupId} />
      </DialogContent>
    </Dialog>
  )
}
