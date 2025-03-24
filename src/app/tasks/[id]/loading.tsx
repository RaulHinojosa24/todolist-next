import TodoListSkeleton from "@/components/skeletons/todo-list-skeleton"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="grow flex flex-col items-center pt-[4.5rem] space-y-6">
      <div className="flex gap-2 w-full justify-center items-center">
        <Skeleton className="h-9 w-1/2" />
        <Skeleton className="h-6 aspect-square rounded-full" />
      </div>
      <Skeleton className="h-9 w-full" />
      <TodoListSkeleton />
      <div className="w-full">
        <Skeleton className="h-4 w-28 mb-1 mx-auto" />
        <Progress value={0} />
      </div>
    </div>
  )
}
