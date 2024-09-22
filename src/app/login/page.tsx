import { redirect } from 'next/navigation'

import { getUserPublicInfo } from '@/app/actions/user'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/atoms/Card'
import { LoginForm } from '@/components/organisms/LoginForm/LoginForm'

interface Props {
  params: {
    token: string
  }
  searchParams: {
    email_verification_required?: string
  }
}

export default async function Login(props: Props) {
  const userPublicInfo = await getUserPublicInfo()
  if (userPublicInfo) return redirect('/todos')

  const isEmailVerificationRequired =
    props.searchParams.email_verification_required !== undefined

  return (
    <>
      {isEmailVerificationRequired && (
        <div>
          Authentication email sent. Please use the link in the authentication
          email to authenticate before logging in.
        </div>
      )}
      <section className="flex h-[calc(100vh-57px)] items-center justify-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <LoginForm />
        </Card>
      </section>
    </>
  )
}
