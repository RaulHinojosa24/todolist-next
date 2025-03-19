import TodoGroupList from "@/components/todo-group/list"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Tasks",
}

export default async function TasksPage() {
  return (
    <>
      <h1>These are your task groups!</h1>
      <TodoGroupList></TodoGroupList>
    </>
  )
}
