import LoginForm from "@/components/login/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"

export default function LoginPage() {
  return (
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
  )
}
