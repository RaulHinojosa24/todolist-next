import { auth } from "@/auth"
import ChangePassword from "@/components/profile/change-password"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import BreadcrumbUpdater from "@/components/ui/breadcrumb-updater"

export async function generateMetadata() {
  const session = await auth()

  return {
    title: session ? `${session.user.username}'s Profile` : "Profile",
  }
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    return (
      <div className="my-auto place-self-center">
        <h1 className="text-2xl font-bold">
          Please log in to view your profile
        </h1>
      </div>
    )
  }
  const { name, username } = session.user
  const avatarFallback = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <>
      <BreadcrumbUpdater
        items={[{ href: "/", label: "Home" }, { label: "Profile" }]}
      />

      <div className="my-auto place-self-center flex flex-col items-center space-y-3">
        <Avatar className="mx-auto size-32 rounded-full">
          {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
          <AvatarFallback className="text-6xl">{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-center text-2xl font-semibold">{name}</p>
          <p className="text-center text font-semibold text-muted-foreground">
            @{username}
          </p>
        </div>
        <ChangePassword />
      </div>
    </>
  )
}
