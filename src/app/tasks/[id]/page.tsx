import { notFound } from "next/navigation"
import TaskListSkeleton from "@/components/skeletons/task-list-skeleton"
import TaskList from "@/components/task/list"
import NewTask from "@/components/task/new"
import { Progress } from "@/components/ui/progress"
import { fetchTaskGroupInfo } from "@/lib/data"
import { UUID } from "crypto"
import { Suspense } from "react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Info } from "lucide-react"
import BreadcrumbUpdater from "@/components/ui/breadcrumb-updater"

export async function generateMetadata(props: {
  params: Promise<{ id: UUID }>
}) {
  const { id } = await props.params
  const taskGroupData = await fetchTaskGroupInfo(id)

  return {
    title:
      "message" in taskGroupData
        ? "owari: error"
        : `owari: ${taskGroupData.name}`,
  }
}

export default async function TaskGroupPage(props: {
  params: Promise<{ id: UUID }>
}) {
  const { id } = await props.params
  const taskGroupData = await fetchTaskGroupInfo(id)

  if (!("id" in taskGroupData)) {
    notFound()
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))

  return (
    <>
      <BreadcrumbUpdater
        items={[
          { href: "/", label: "Home" },
          { href: "/tasks", label: "Tasks" },
          { label: taskGroupData.name },
        ]}
      />
      <div className="page-title justify-center">
        <h1>
          {taskGroupData.name}
          <HoverCard>
            <HoverCardTrigger className="inline-flex ml-2">
              <Info />
            </HoverCardTrigger>
            <HoverCardContent className="text-sm font-normal">
              {taskGroupData.description
                ? taskGroupData.description
                : "No description"}
            </HoverCardContent>
          </HoverCard>
        </h1>
      </div>
      <NewTask taskGroupId={id} />
      <div className="grow">
        <Suspense fallback={<TaskListSkeleton />}>
          <TaskList taskGroupId={id} />
        </Suspense>
      </div>
      <div>
        <p className="text-sm text-muted-foreground text-center mb-1">
          {taskGroupData.completed_count} of {taskGroupData.total_count}{" "}
          completed
        </p>
        <Progress
          value={
            (taskGroupData.completed_count * 100) / taskGroupData.total_count
          }
        />
      </div>
    </>
  )
}
