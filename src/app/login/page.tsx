import LoginForm from "@/components/login/form"
import BreadcrumbUpdater from "@/components/ui/breadcrumb-updater"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Log In",
}

export default function LoginPage() {
  return (
    <>
      <BreadcrumbUpdater
        items={[{ href: "/", label: "Home" }, { label: "Login" }]}
      />

      <Card className="my-auto place-self-center">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </>
  )
}
