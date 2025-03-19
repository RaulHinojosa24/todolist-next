"use client"

import { Button } from "@/components/ui/button"
import { createTodoGroup, editTodoGroup, TodoGroupState } from "@/lib/actions"
import { useActionState, useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { TodoGroup } from "@/lib/definitions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function TodoGroupForm({
  close,
  todoGroup,
}: {
  close: () => void
  todoGroup?: TodoGroup
}) {
  const router = useRouter()
  const initialState: TodoGroupState = { message: null, errors: {} }
  const [state, formAction] = useActionState(
    todoGroup ? editTodoGroup.bind(null, todoGroup.id) : createTodoGroup,
    initialState
  )
  const [name, setName] = useState(todoGroup ? todoGroup.name : "")
  const [description, setDescription] = useState(
    todoGroup ? todoGroup.description : ""
  )

  useEffect(() => {
    if (!state) {
      close()
      toast.success(`Task group modified successfully!`)
    }
    const success = state?.id
    if (success) {
      toast.success(`Task group created successfully!`)
      router.push(`/tasks/${state.id}`)
    }
  }, [state, router, close, todoGroup])

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Group Name</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
        {state?.errors?.name && (
          <p className="mt-2 text-sm text-destructive">{state.errors.name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {state?.errors?.description && (
          <p className="mt-2 text-sm text-destructive">
            {state.errors.description}
          </p>
        )}
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button type="button" variant={"outline"} onClick={close}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}
