import { Button } from "./button"
import Link from "next/link"
import UserActions from "@/components/navbar/user-actions"
import { ThemeToggle } from "./theme-toggle"
import Logo from "@/components/assets/Logo"

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between gap-4 p-2">
      <div className="flex gap-2">
        <Logo className="h-9" />
        <Link href={"/"}>
          <Button variant={"link"}>Home</Button>
        </Link>
        <Link href={"/tasks"}>
          <Button variant={"link"}>Tasks</Button>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserActions />
      </div>
    </nav>
  )
}
