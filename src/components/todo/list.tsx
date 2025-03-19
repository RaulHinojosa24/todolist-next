import { fetchTodoItems } from "@/lib/data"
import TodoItem from "./item"
import { UUID } from "crypto"
import NewTodo from "./new"
import { ClientToastTrigger } from "../ui/sonner"

export default async function TodoList({ todoGroupId }: { todoGroupId: UUID }) {
  const todoList = await fetchTodoItems(todoGroupId)

  return (
    <>
      {Array.isArray(todoList) ? (
        <div className="w-full space-y-4">
          <NewTodo todoGroupId={todoGroupId} />
          <ul>
            {todoList.map((item) => (
              <TodoItem key={item.id} item={item} />
            ))}
          </ul>
        </div>
      ) : (
        <>
          <p>{todoList.message}</p>
          <ClientToastTrigger message={todoList.message} type="error" />
        </>
      )}
    </>
  )
}
