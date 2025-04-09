import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="my-auto place-self-center space-y-3 flex flex-col items-center">
      <Skeleton className="mx-auto size-32 rounded-full"></Skeleton>
      <div className="space-y-1 flex flex-col items-center">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-24 h-5" />
      </div>
      <Button className="w-45" disabled>
        <Loader2 className="animate-spin" />
      </Button>
    </div>
  )
}
