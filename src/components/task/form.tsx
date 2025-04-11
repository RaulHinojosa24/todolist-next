"use client"

import { Button } from "@/components/ui/button"
import { createTaskItem, editTaskItem, TaskItemState } from "@/lib/actions"
import { useActionState, useEffect, useState } from "react"
import { TaskItem } from "@/lib/definitions"
import { UUID } from "crypto"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { TASK_ITEM_MAX_LENGTH } from "@/lib/constants"

export default function TaskForm({
  close,
  data,
}: {
  close: () => void
  data: TaskItem | UUID
}) {
  const isCreation = typeof data === "string"
  const initialState: TaskItemState = { message: null, errors: {} }
  const [formDisabled, setFormDisabled] = useState(false)
  const [state, formAction] = useActionState(
    isCreation
      ? createTaskItem.bind(null, data)
      : editTaskItem.bind(null, data.id),
    initialState
  )
  const [text, setText] = useState(isCreation ? "" : data.text)
  const textLength = text.trim().length
  const isTextValid = textLength > 0 && textLength <= TASK_ITEM_MAX_LENGTH

  useEffect(() => {
    if (!state) {
      close()
      toast.success(`Task ${isCreation ? "created" : "modified"} successfully!`)
    } else {
      setFormDisabled(false)
    }
  }, [state, close, isCreation])

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
        <Input
          name="task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          autoFocus
        />
        <div className="flex flex-row-reverse justify-between gap-4 mt-2 text-sm">
          <p
            className={
              isTextValid ? "text-muted-foreground" : "text-destructive"
            }
          >
            {textLength}/{TASK_ITEM_MAX_LENGTH}
          </p>
          {state?.errors?.task && (
            <p className="text-sm text-destructive">{state.errors.task}</p>
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
      </div>{" "}
    </form>
  )
}
