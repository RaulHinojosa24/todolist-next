import { fetchTaskItems } from "@/lib/data"
import TaskItem from "./item"
import { UUID } from "crypto"
import { ClientToastTrigger } from "@/components/ui/sonner"

export default async function TaskList({ taskGroupId }: { taskGroupId: UUID }) {
  const taskList = await fetchTaskItems(taskGroupId)

  return (
    <>
      {Array.isArray(taskList) ? (
        <>
          {taskList.length > 0 ? (
            <>
              <ul className="space-y-1">
                {taskList.map((item) => (
                  <TaskItem key={item.id} item={item} />
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
          <p>{taskList.message}</p>
          <ClientToastTrigger message={taskList.message} type="error" />
        </>
      )}
    </>
  )
}
