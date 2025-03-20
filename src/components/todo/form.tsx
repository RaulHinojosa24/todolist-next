"use client"

import { Button } from "@/components/ui/button"
import { createTodoItem, editTodoItem, TodoItemState } from "@/lib/actions"
import { useActionState, useEffect, useState } from "react"
import { TodoItem } from "@/lib/definitions"
import { UUID } from "crypto"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { TODO_ITEM_MAX_LENGTH } from "@/lib/constants"

export default function TodoForm({
  close,
  data,
}: {
  close: () => void
  data: TodoItem | UUID
}) {
  const isCreation = typeof data === "string"
  const initialState: TodoItemState = { message: null, errors: {} }
  const [state, formAction] = useActionState(
    isCreation
      ? createTodoItem.bind(null, data)
      : editTodoItem.bind(null, data.id),
    initialState
  )
  const [text, setText] = useState(isCreation ? "" : data.text)
  const textLength = text.trim().length
  const isTextValid = textLength > 0 && textLength <= TODO_ITEM_MAX_LENGTH

  useEffect(() => {
    if (!state) {
      close()
      toast.success(`Task ${isCreation ? "created" : "modified"} successfully!`)
    }
  }, [state, close, isCreation])

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Input
          name="todo"
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
            {textLength}/{TODO_ITEM_MAX_LENGTH}
          </p>
          {state?.errors?.todo && (
            <p className="text-destructive">{state.errors.todo}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button type="button" variant={"outline"} onClick={close}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>{" "}
    </form>
  )
}
