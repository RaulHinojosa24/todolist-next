"use client"

import React, { useActionState, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import PasswordInput from "@/components/ui/password-input"
import { updateCustomerPassword } from "@/lib/actions"
import { toast } from "sonner"

export default function PasswordForm({ close }: { close: () => void }) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [errorMessage, formAction, isPending] = useActionState(
    updateCustomerPassword,
    undefined
  )

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    if (isPending) {
      e.preventDefault()
      return
    }
  }

  useEffect(() => {
    if (!isPending && errorMessage === null) {
      toast.success("Password changed successfully!")
      close()
    }
  }, [close, errorMessage, isPending])

  return (
    <form onSubmit={submitHandler} action={formAction} className="space-y-3">
      <div className="space-y-2">
        <div>
          <Label htmlFor="new-password">New Password</Label>
          <PasswordInput
            id="new-password"
            name="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <PasswordInput
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>
      {errorMessage?.errors && (
        <>
          <p className="text-sm text-destructive">{errorMessage.errors}</p>
        </>
      )}
      <Button disabled={isPending}>Change Password</Button>
    </form>
  )
}
