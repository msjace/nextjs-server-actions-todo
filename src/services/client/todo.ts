import { startTransition } from 'react'

import { arrayMove } from '@dnd-kit/sortable'

import type { ITodo } from '@/common/interfaces/todo'
import type { ErrorMessageState } from '@/services/client/alert'
import type { DragEndEvent } from '@dnd-kit/core'

import { addTodo, deleteTodo, updatePriorities } from '@/app/actions/todo'

type Action = 'delete' | 'update' | 'create'

export type TodoOptimisticUpdate = (action: {
  action: Action
  todo: ITodo | ITodo[]
}) => void

export function todoUpdateFn(
  state: ITodo[],
  { action, todo }: { action: Action; todo: ITodo | ITodo[] }
) {
  switch (action) {
    case 'create':
      if (!Array.isArray(todo)) return [...state, todo]
    case 'update':
      if (Array.isArray(todo)) {
        return todo
      } else {
        return state.map((t) => (t.id === todo.id ? todo : t))
      }
    case 'delete':
      if (!Array.isArray(todo)) return state.filter(({ id }) => id !== todo.id)
    default:
      return state
  }
}

export const onTodoDragEnd = async (
  event: DragEndEvent,
  optimisticTodos: ITodo[],
  optimisticTodosUpdate: TodoOptimisticUpdate,
  todos: ITodo[]
) => {
  const { active, over } = event
  if (over == null || active.id === over.id) {
    return
  }
  const oldIndex = optimisticTodos.findIndex((item) => item.id === active.id)
  const newIndex = optimisticTodos.findIndex((item) => item.id === over.id)
  const newDisplayItems = arrayMove(optimisticTodos, oldIndex, newIndex)

  startTransition(() => {
    optimisticTodosUpdate({
      action: 'update',
      todo: newDisplayItems,
    })
  })

  const newItems = newDisplayItems.map((item: ITodo, index: number) => {
    return {
      ...item,
      priority: index + 1,
    }
  })
  const todoUpdates = newItems.filter(
    (item: ITodo) =>
      todos.find((t) => t.id === item.id)?.priority !== item.priority
  )
  await updatePriorities(todoUpdates)
}

export const initTodo = (userId: string, maxPriority: number): ITodo => {
  return {
    id: 0,
    user_id: userId,
    title: '',
    is_completed: false,
    priority: maxPriority + 1,
    created_at: '',
    updated_at: '',
  }
}

export const addFormAction = async (
  data: FormData,
  todo: ITodo,
  optimisticUpdate: TodoOptimisticUpdate,
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessageState>>,
  formRef: React.RefObject<HTMLFormElement>
) => {
  todo.title = data.get('todo') as string
  optimisticUpdate({ action: 'create', todo })

  const errorMessage = await addTodo(todo)
  if (errorMessage) setErrorMessage(errorMessage)

  formRef.current?.reset()
}

export const deleteFormAction = async (
  optimisticUpdate: TodoOptimisticUpdate,
  todo: ITodo
) => {
  optimisticUpdate({ action: 'delete', todo })

  await deleteTodo(todo.id)
}
