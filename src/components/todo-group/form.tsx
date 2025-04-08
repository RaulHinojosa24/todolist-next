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
import {
  TODO_GROUP_DESCRIPTION_MAX_LENGTH,
  TODO_GROUP_NAME_MAX_LENGTH,
} from "@/lib/constants"
import { cn } from "@/lib/utils"

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
  const [formDisabled, setFormDisabled] = useState(false)
  const [name, setName] = useState(todoGroup ? todoGroup.name : "")
  const nameLength = name.trim().length
  const isNameValid = nameLength > 0 && nameLength <= TODO_GROUP_NAME_MAX_LENGTH
  const [description, setDescription] = useState(
    todoGroup ? todoGroup.description : ""
  )
  const descriptionLength = description.trim().length
  const isDescriptionValid =
    descriptionLength <= TODO_GROUP_DESCRIPTION_MAX_LENGTH

  useEffect(() => {
    if (!state) {
      close()
      toast.success(`Task group modified successfully!`)
    }
    const success = state?.id
    if (success) {
      close()
      toast.success(`Task group created successfully!`)
      router.push(`/tasks/${state.id}`)
    } else {
      setFormDisabled(false)
    }
  }, [state, router, close, todoGroup])

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    if (formDisabled) {
      e.preventDefault()
      return
    }
    setFormDisabled(true)
  }

  return (
    <form onSubmit={submitHandler} action={formAction} className="space-y-4">
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
        <div className="flex flex-row-reverse justify-between gap-4 mt-2 text-sm">
          <p
            className={cn(
              "shrink-0",
              isNameValid ? "text-muted-foreground" : "text-destructive"
            )}
          >
            {nameLength}/{TODO_GROUP_NAME_MAX_LENGTH}
          </p>

          {state?.errors?.name && (
            <p className="text-sm text-destructive">{state.errors.name}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex flex-row-reverse justify-between gap-4 text-sm mt-2">
          <p
            className={cn(
              "shrink-0",
              isDescriptionValid ? "text-muted-foreground" : "text-destructive"
            )}
          >
            {descriptionLength}/{TODO_GROUP_DESCRIPTION_MAX_LENGTH}
          </p>
          {state?.errors?.description && (
            <p className="text-sm text-destructive">
              {state.errors.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button type="button" variant={"outline"} onClick={close}>
          Cancel
        </Button>
        <Button type="submit" disabled={formDisabled}>
          Submit
        </Button>
      </div>
    </form>
  )
}
