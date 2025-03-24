import TodoListSkeleton from "@/components/skeletons/todo-list-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full gap-4 flex flex-col items-center">
      <Skeleton className="h-9 w-1/2" />
      <Skeleton className="h-9 w-full" />
      <TodoListSkeleton />
    </div>
  )
}
