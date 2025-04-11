import TaskGroupListSkeleton from "@/components/skeletons/task-group-list-skeleton"
import TaskGroupList from "@/components/task-group/list"
import NewTaskGroup from "@/components/task-group/new"
import BreadcrumbUpdater from "@/components/ui/breadcrumb-updater"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "My Task Groups",
}

export default async function TasksPage() {
  return (
    <>
      <BreadcrumbUpdater
        items={[{ href: "/", label: "Home" }, { label: "Tasks" }]}
      />

      <h1 className="page-title">My Task Groups</h1>
      <NewTaskGroup />
      <div className="grow">
        <Suspense fallback={<TaskGroupListSkeleton />}>
          <TaskGroupList />
        </Suspense>
      </div>
    </>
  )
}
