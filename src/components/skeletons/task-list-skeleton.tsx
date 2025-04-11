import { Skeleton } from "@/components/ui/skeleton"

export default function TaskListSkeleton() {
  return (
    <ul className="w-full grow">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <ItemSkeleton key={i} />
        ))}
    </ul>
  )
}

function ItemSkeleton() {
  const widthClasses = ["w-1/2", "w-3/4", "w-1/3", "w-2/3", "w-1/4", "w-3/5"]
  const randomWidth =
    widthClasses[Math.floor(Math.random() * widthClasses.length)]
  return (
    <div className="flex items-center justify-between gap-2 h-9">
      <Skeleton className="h-4 aspect-square" />
      <Skeleton className={"h-4 " + randomWidth} />
      <Skeleton className="h-4 ml-auto aspect-1/2" />
    </div>
  )
}
