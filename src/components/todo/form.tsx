"use client"

import { Button } from "@/components/ui/button"
import { createTodoItem, editTodoItem, TodoItemState } from "@/lib/actions"
import { useActionState, useEffect, useState } from "react"
import { TodoItem } from "@/lib/definitions"
import { UUID } from "crypto"
import { toast } from "sonner"
import { Input } from "../ui/input"

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
        />
        {state?.errors?.todo && (
          <p className="mt-2 text-sm text-destructive">{state.errors.todo}</p>
        )}
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
