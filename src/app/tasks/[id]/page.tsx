import TodoListSkeleton from "@/components/skeletons/todo-list-skeleton"
import TodoList from "@/components/todo/list"
import NewTodo from "@/components/todo/new"
import { Progress } from "@/components/ui/progress"
import { fetchTodoGroupInfo } from "@/lib/data"
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
  const todoGroupData = await fetchTodoGroupInfo(id)

  return {
    title:
      "message" in todoGroupData
        ? "owari: error"
        : `owari: ${todoGroupData.name}`,
  }
}

export default async function TodoGroupPage(props: {
  params: Promise<{ id: UUID }>
}) {
  const { id } = await props.params
  const todoGroupData = await fetchTodoGroupInfo(id)
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return "id" in todoGroupData ? (
    <>
      <BreadcrumbUpdater
        items={[
          { href: "/tasks", label: "Tasks" },
          { label: todoGroupData.name },
        ]}
      />
      <div className="min-h-[6.75rem] h-fit flex items-end justify-center">
        <h1>
          {todoGroupData.name}
          <HoverCard>
            <HoverCardTrigger className="inline-flex ml-2">
              <Info />
            </HoverCardTrigger>
            <HoverCardContent className="text-sm font-normal">
              {todoGroupData.description
                ? todoGroupData.description
                : "No description"}
            </HoverCardContent>
          </HoverCard>
        </h1>
      </div>
      <NewTodo todoGroupId={id} />
      <div className="grow">
        <Suspense fallback={<TodoListSkeleton />}>
          <TodoList todoGroupId={id} />
        </Suspense>
      </div>
      <div>
        <p className="text-sm text-muted-foreground text-center mb-1">
          {todoGroupData.completed_count} of {todoGroupData.total_count}{" "}
          completed
        </p>
        <Progress
          value={
            (todoGroupData.completed_count * 100) / todoGroupData.total_count
          }
        />
      </div>
    </>
  ) : (
    <p>{todoGroupData.message}</p>
  )
}
