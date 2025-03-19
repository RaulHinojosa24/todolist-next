import { auth, signOut } from "@/auth"
import { Button } from "../ui/button"
import Link from "next/link"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default async function UserActions() {
  return (
    <Suspense
      fallback={
        <Button disabled>
          <Loader2 className="animate-spin" /> ...
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
          <p className="capitalize">Hi, {session.user.name}</p>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <Button variant={"secondary"}>Log Out</Button>
          </form>
        </div>
      ) : (
        <Link href={"login"}>
          <Button variant={"secondary"}>Log In</Button>
        </Link>
      )}
    </>
  )
}
