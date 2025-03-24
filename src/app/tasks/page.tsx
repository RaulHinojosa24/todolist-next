import TodoGroupListSkeleton from "@/components/skeletons/todo-group-list-skeleton"
import TodoGroupList from "@/components/todo-group/list"
import NewTodoGroup from "@/components/todo-group/new"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "owari: my tasks",
}

export default async function TasksPage() {
  return (
    <div className="w-full space-y-4">
      <h1>These are your task groups!</h1>
      <NewTodoGroup />
      <Suspense fallback={<TodoGroupListSkeleton />}>
        <TodoGroupList />
      </Suspense>
    </div>
  )
}
