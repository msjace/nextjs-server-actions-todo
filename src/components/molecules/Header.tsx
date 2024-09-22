import Link from 'next/link'

import { signOut } from '@/app/actions/auth'
import { getUserPublicInfo } from '@/app/actions/user'
import { Button } from '@/components/atoms/Button'

export default async function Header() {
  const userPublicInfo = await getUserPublicInfo()

  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link href="/todos">Todo List</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {userPublicInfo ? (
            <form action={signOut} className="flex items-center gap-2">
              <p>{userPublicInfo.email}</p>
              <Button>Sign Out</Button>
            </form>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
