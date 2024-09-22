import { redirect } from 'next/navigation'

import { getUserPublicInfo } from '@/app/actions/user'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/atoms/Card'
import { SignupForm } from '@/components/organisms/SignupForm/SignupForm'

export default async function SignUp() {
  const userPublicInfo = await getUserPublicInfo()
  if (userPublicInfo) return redirect('/todos')

  return (
    <section className="flex h-[calc(100vh-57px)] items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        <SignupForm />
      </Card>
    </section>
  )
}
