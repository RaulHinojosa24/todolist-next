import { Skeleton } from "@/components/ui/skeleton"

export default function TodoGroupListSkeleton() {
  return (
    <div>
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
      </ul>
    </div>
  )
}
