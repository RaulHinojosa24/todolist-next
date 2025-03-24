import { fetchTodoItems } from "@/lib/data"
import TodoItem from "./item"
import { UUID } from "crypto"
import { ClientToastTrigger } from "@/components/ui/sonner"

export default async function TodoList({ todoGroupId }: { todoGroupId: UUID }) {
  const todoList = await fetchTodoItems(todoGroupId)

  return (
    <>
      {Array.isArray(todoList) ? (
        <>
          {todoList.length > 0 ? (
            <>
              <ul className="space-y-1">
                {todoList.map((item) => (
                  <TodoItem key={item.id} item={item} />
                ))}
              </ul>
            </>
          ) : (
            <p className="text-center">
              You currently have no tasks, go on and create some!
            </p>
          )}
        </>
      ) : (
        <>
          <p>{todoList.message}</p>
          <ClientToastTrigger message={todoList.message} type="error" />
        </>
      )}
    </>
  )
}
