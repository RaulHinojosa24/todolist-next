import { fetchTodoGroups } from "@/lib/data"
import TodoGroupItem from "./item"

export default async function TodoGroupList() {
  const todoGroups = await fetchTodoGroups()

  return (
    <>
      {Array.isArray(todoGroups) ? (
        <div className="w-full">
          {todoGroups.length > 0 ? (
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {todoGroups.map((item) => (
                <TodoGroupItem key={item.id} item={item} />
              ))}
            </ul>
          ) : (
            <p className="text-center">
              You currently have no task groups, go on and create some!
            </p>
          )}
        </div>
      ) : (
        <p>{todoGroups.message}</p>
      )}
    </>
  )
}
