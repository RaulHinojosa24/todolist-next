import { auth } from "@/auth"
import ChangePassword from "@/components/profile/change-password"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import BreadcrumbUpdater from "@/components/ui/breadcrumb-updater"

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
  const avatarFallback = username[0].toUpperCase()

  return (
    <>
      <BreadcrumbUpdater
        items={[{ href: "/", label: "Home" }, { label: "Profile" }]}
      />

      <div className="my-auto place-self-center overflow-auto space-y-3">
        <Avatar className="mx-auto size-32 rounded-full">
          {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
          <AvatarFallback className="text-6xl">{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-center text-2xl font-semibold">{username}</p>
          <p className="text-center text-sm font-semibold text-muted-foreground">
            {name}
          </p>
        </div>
        <ChangePassword />
      </div>
    </>
  )
}
