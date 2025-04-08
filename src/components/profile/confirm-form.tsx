"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import PasswordInput from "@/components/ui/password-input"
import { useActionState, useEffect, useState } from "react"
import { confirmPassword } from "@/lib/actions"

export default function PasswordConfirmForm({
  onConfirm,
}: {
  onConfirm: () => void
}) {
  const [password, setPassword] = useState("")
  const [errorMessage, formAction, isPending] = useActionState(
    confirmPassword,
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
      console.log("Password confirmed")
      onConfirm()
    }
  }, [isPending, errorMessage, onConfirm])

  return (
    <form onSubmit={submitHandler} action={formAction} className="space-y-3">
      <div>
        <Label htmlFor="current-password">
          Please confirm your current password
        </Label>
        <PasswordInput
          id="current-password"
          name="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {errorMessage?.errors && (
        <>
          <p className="text-sm text-destructive">{errorMessage.errors}</p>
        </>
      )}
      <Button type="submit" disabled={isPending}>
        Confirm
      </Button>
    </form>
  )
}
