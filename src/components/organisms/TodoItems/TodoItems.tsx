import { useState } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

import styles from './TodoItems.module.scss'

import type { ITodo } from '@/common/interfaces/todo'
import type { CheckedState } from '@radix-ui/react-checkbox'

import { updateTodo } from '@/app/actions/todo'
import { cn } from '@/common/tw_merge'
import { Button } from '@/components/atoms/Button'
import { Card, CardContent } from '@/components/atoms/Card'
import { Checkbox } from '@/components/atoms/Checkbox'
import {
  deleteFormAction,
  type TodoOptimisticUpdate,
} from '@/services/client/todo'

interface ITodoItemsProps {
  todo: ITodo
  optimisticUpdate: TodoOptimisticUpdate
  userId: string
}

export const TodoItems: React.FC<ITodoItemsProps> = (props) => {
  return (
    <form>
      <TodoCardCopy
        optimisticUpdate={props.optimisticUpdate}
        todo={props.todo}
        userId={props.userId}
      />
    </form>
  )
}
function TodoCardCopy({
  todo,
  optimisticUpdate,
}: {
  todo: ITodo
  optimisticUpdate: TodoOptimisticUpdate
  userId: string
}) {
  const {
    isDragging,
    setActivatorNodeRef,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id })
  const { pending } = useFormStatus()
  const [checked, setChecked] = useState(todo.is_completed)

  const onCheckedChange = async (value: CheckedState) => {
    if (value === 'indeterminate') return
    setChecked(value)
    await updateTodo({
      ...todo,
      is_completed: value,
    })
  }

  const formAction = async (): Promise<void> =>
    await deleteFormAction(optimisticUpdate, todo)

  return (
    <Card
      ref={setNodeRef}
      className={cn('w-full', pending && 'opacity-50', {
        [styles._active]: isDragging,
      })}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <CardContent className="flex items-start gap-3 p-3">
        <div
          ref={setActivatorNodeRef}
          className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} `}
          {...attributes}
          {...listeners}
        >
          <span>::</span>
        </div>
        <span className="flex size-10 items-center justify-center">
          <Checkbox
            disabled={pending}
            checked={Boolean(checked)}
            onCheckedChange={onCheckedChange}
          />
        </span>
        <p className={cn('flex-1 pt-2 min-w-0 break-words')}>{todo.title}</p>
        <Button
          disabled={pending}
          formAction={formAction}
          variant="ghost"
          size="icon"
        >
          <Trash2 className="size-5" />
          <span className="sr-only">Delete Todo</span>
        </Button>
      </CardContent>
    </Card>
  )
}
