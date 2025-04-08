"use client"

import { useActionState, useState } from "react"
import { authenticate } from "@/lib/actions"
import { useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PasswordInput from "../ui/password-input"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/tasks"
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  )

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        ></Input>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      {errorMessage && (
        <>
          <p className="text-sm text-destructive"> {errorMessage} </p>
        </>
      )}
      <Button type="submit" disabled={isPending}>
        Log In
      </Button>
    </form>
  )
}
