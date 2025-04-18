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
import { Edit } from "lucide-react"
import { useCallback, useState } from "react"
import PasswordForm from "./update-form"
import PasswordConfirmForm from "./confirm-form"

export default function ChangePassword() {
  const [open, setOpen] = useState(false)
  const [isConfirm, setIsConfirm] = useState(true)

  const onConfirm = useCallback(() => {
    setIsConfirm(false)
  }, [])
  const onUpdate = useCallback(() => {
    setIsConfirm(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Edit />
          <span>Change Password</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Changing Password</DialogTitle>
          <DialogDescription>
            How should my next password be like...?
          </DialogDescription>
        </DialogHeader>
        {isConfirm ? (
          <PasswordConfirmForm onConfirm={onConfirm} />
        ) : (
          <PasswordForm close={handleClose} onUpdate={onUpdate} />
        )}
      </DialogContent>
    </Dialog>
  )
}
