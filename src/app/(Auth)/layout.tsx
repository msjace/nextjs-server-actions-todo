import { redirect } from 'next/navigation'

import type { ReactChildren } from '@/common/interfaces/react_children'

import { getSession } from '@/app/actions/auth'

export default async function Layout(
  props: ReactChildren
): Promise<React.ReactElement> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  return <>{props.children}</>
}
