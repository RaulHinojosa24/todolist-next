import TodoGroupList from "@/components/todo-group/list"
import NewTodoGroup from "@/components/todo-group/new"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Tasks",
}

export default async function TasksPage() {
  return (
    <div className="w-full space-y-4">
      <h1>These are your task groups!</h1>
      <NewTodoGroup />
      <TodoGroupList />
    </div>
  )
}
