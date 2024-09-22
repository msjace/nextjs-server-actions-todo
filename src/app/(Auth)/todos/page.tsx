import { getTodos } from '@/app/actions/todo'
import { getUserPublicInfo } from '@/app/actions/user'
import { Separator } from '@/components/atoms/Separator'
import { TodoList } from '@/components/organisms/TodoList/TodoList'

export default async function Page() {
  const userPublicInfo = await getUserPublicInfo()
  if (!userPublicInfo) return null

  const todos = await getTodos(userPublicInfo.id)

  return (
    <section className="flex w-full max-w-2xl flex-col gap-4 p-3 pt-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Todo List
      </h1>
      <Separator className="w-full" />
      <TodoList todos={todos} userId={userPublicInfo.id} />
    </section>
  )
}
