"use client"

import { useActionState } from "react"
import { authenticate } from "@/lib/actions"
import { useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/tasks"
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  )

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input name="username" required></Input>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" required></Input>
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      {errorMessage && (
        <>
          <p className="text-sm text-red-500"> {errorMessage} </p>
        </>
      )}
      <Button type="submit" disabled={isPending}>
        Log In
      </Button>
    </form>
  )
}
