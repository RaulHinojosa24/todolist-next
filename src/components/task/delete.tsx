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
import { deleteTaskItem } from "@/lib/actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { UUID } from "crypto"
import { Trash2 } from "lucide-react"

export default function DeleteTaskItem({ id }: { id: UUID }) {
  async function deleteHandler() {
    const res = deleteTaskItem.bind(null, id)()

    toast.promise(res, {
      loading: "Loading...",
      success: () => {
        return `Task has been deleted.`
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
            This will permanently delete that task.
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
