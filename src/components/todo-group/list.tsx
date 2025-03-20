import { fetchTodoGroups } from "@/lib/data"
import TodoGroupItem from "./item"

export default async function TodoGroupList() {
  const todoGroups = await fetchTodoGroups()

  return (
    <>
      {Array.isArray(todoGroups) ? (
        <div className="w-full space-y-4">
          {todoGroups.length > 0 ? (
            <ul className="grid md:grid-cols-3 gap-4">
              {todoGroups.map((item) => (
                <TodoGroupItem key={item.id} item={item} />
              ))}
            </ul>
          ) : (
            <p>You currently have no task groups, go on and create some!</p>
          )}
        </div>
      ) : (
        <p>{todoGroups.message}</p>
      )}
    </>
  )
}
