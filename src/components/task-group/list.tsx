import { fetchTaskGroups } from "@/lib/data"
import TaskGroupItem from "./item"

export default async function TaskGroupList() {
  const taskGroups = await fetchTaskGroups()

  return (
    <>
      {Array.isArray(taskGroups) ? (
        <div className="w-full">
          {taskGroups.length > 0 ? (
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {taskGroups.map((item) => (
                <TaskGroupItem key={item.id} item={item} />
              ))}
            </ul>
          ) : (
            <p className="text-center">
              You currently have no task groups, go on and create some!
            </p>
          )}
        </div>
      ) : (
        <p>{taskGroups.message}</p>
      )}
    </>
  )
}
