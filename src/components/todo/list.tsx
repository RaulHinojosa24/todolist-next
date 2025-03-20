import { fetchTodoItems } from "@/lib/data"
import TodoItem from "./item"
import { UUID } from "crypto"
import { ClientToastTrigger } from "@/components/ui/sonner"
import { Progress } from "@/components/ui/progress"

export default async function TodoList({ todoGroupId }: { todoGroupId: UUID }) {
  const todoList = await fetchTodoItems(todoGroupId)

  return (
    <>
      {Array.isArray(todoList) ? (
        <>
          {todoList.length > 0 ? (
            <>
              <ul className="w-full">
                {todoList.map((item) => (
                  <TodoItem key={item.id} item={item} />
                ))}
              </ul>
              <Progress
                value={
                  (todoList.reduce(
                    (acc, curr) => (acc += curr.completed ? 1 : 0),
                    0
                  ) *
                    100) /
                  todoList.length
                }
              />
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
