"use client"

import { Button } from "@/components/ui/button"
import { createTaskGroup, editTaskGroup, TaskGroupState } from "@/lib/actions"
import { useActionState, useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { TaskGroup } from "@/lib/definitions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  TASK_GROUP_DESCRIPTION_MAX_LENGTH,
  TASK_GROUP_NAME_MAX_LENGTH,
} from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function TaskGroupForm({
  close,
  taskGroup,
}: {
  close: () => void
  taskGroup?: TaskGroup
}) {
  const router = useRouter()
  const initialState: TaskGroupState = { message: null, errors: {} }
  const [state, formAction] = useActionState(
    taskGroup ? editTaskGroup.bind(null, taskGroup.id) : createTaskGroup,
    initialState
  )
  const [formDisabled, setFormDisabled] = useState(false)
  const [name, setName] = useState(taskGroup ? taskGroup.name : "")
  const nameLength = name.trim().length
  const isNameValid = nameLength > 0 && nameLength <= TASK_GROUP_NAME_MAX_LENGTH
  const [description, setDescription] = useState(
    taskGroup ? taskGroup.description : ""
  )
  const descriptionLength = description.trim().length
  const isDescriptionValid =
    descriptionLength <= TASK_GROUP_DESCRIPTION_MAX_LENGTH

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
  }, [state, router, close, taskGroup])

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
            {nameLength}/{TASK_GROUP_NAME_MAX_LENGTH}
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
            {descriptionLength}/{TASK_GROUP_DESCRIPTION_MAX_LENGTH}
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
