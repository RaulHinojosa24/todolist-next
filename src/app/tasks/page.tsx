import TodoGroupListSkeleton from "@/components/skeletons/todo-group-list-skeleton"
import TodoGroupList from "@/components/todo-group/list"
import NewTodoGroup from "@/components/todo-group/new"
import BreadcrumbUpdater from "@/components/ui/breadcrumb-updater"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "owari: my tasks",
}

export default async function TasksPage() {
  return (
    <>
      <BreadcrumbUpdater
        items={[{ href: "/", label: "Home" }, { label: "Tasks" }]}
      />

      <h1 className="page-title">These are your task groups!</h1>
      <NewTodoGroup />
      <div className="grow">
        <Suspense fallback={<TodoGroupListSkeleton />}>
          <TodoGroupList />
        </Suspense>
      </div>
    </>
  )
}
