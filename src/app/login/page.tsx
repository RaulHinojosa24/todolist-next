import LoginForm from "@/components/login/form"
import BreadcrumbUpdater from "@/components/ui/breadcrumb-updater"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <>
      <BreadcrumbUpdater items={[{ label: "Login" }]} />

      <Card>
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
