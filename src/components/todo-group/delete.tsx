import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteTodoGroup } from "@/lib/actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { UUID } from "crypto"
import { useRouter } from "next/navigation"

export default function DeleteTodoGroup({ id }: { id: UUID }) {
  const router = useRouter()
  function deleteHandler() {
    const res = deleteTodoGroup.bind(null, id)()

    toast.promise(res, {
      loading: "Loading...",
      success: () => {
        router.push("/tasks")
        return `Task group has been deleted.`
      },
      error: (error) => {
        return error.message
      },
    })
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button role="menuitem" variant={"destructive"} size={"dropdown"}>
          <Trash2 />
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete that task group.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onClick={deleteHandler}>
            Yes, do it!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
