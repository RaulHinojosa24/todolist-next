import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function UserActions() {
  return (
    <Suspense
      fallback={
        <Button disabled>
          <Loader2 className="animate-spin" />
        </Button>
      }
    >
      <Async />
    </Suspense>
  )
}

async function Async() {
  const session = await auth()

  return (
    <>
      {session ? (
        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>{session.user.name}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <form
                  action={async () => {
                    "use server"
                    await signOut({ redirectTo: "/" })
                  }}
                >
                  <button>Log Out</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link href={"login"}>
          <Button>Log In</Button>
        </Link>
      )}
    </>
  )
}
