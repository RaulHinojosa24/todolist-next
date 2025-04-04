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
import { Plus } from "lucide-react"

export default function NewTodoGroup({ isSidebar }: { isSidebar?: boolean }) {
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size={isSidebar ? "dropdown" : "default"}>
          <Plus />
          <span>new task group</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Creating a New Task Group</DialogTitle>
          <DialogDescription>
            What kind of tasks are you planning to do?
          </DialogDescription>
        </DialogHeader>
        <TodoGroupForm close={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
