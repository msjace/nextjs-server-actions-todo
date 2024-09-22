'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'

import { signup } from '@/app/actions/auth'
import { Button } from '@/components/atoms/Button'
import { CardContent } from '@/components/atoms/Card'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { useErrorAlert } from '@/services/client/alert'

export const SignupForm: React.FC = () => {
  const [state, formAction] = useFormState(signup, null)

  useErrorAlert(state)

  return (
    <CardContent className="flex flex-col gap-4">
      <form action={formAction} id="login-form" className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            minLength={8}
            name="password"
            id="password"
            type="password"
            required
          />
        </div>
        <Button className="w-full" type="submit" variant="primary">
          Sign Up
        </Button>
      </form>
      <div className="text-center text-sm">
        Do you have an account?
        <Link className="underline" href="/login">
          Login
        </Link>
      </div>
    </CardContent>
  )
}
