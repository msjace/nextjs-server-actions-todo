'use client'
import { useRef, useState } from 'react'

import { CirclePlus } from 'lucide-react'
import { useFormStatus } from 'react-dom'

import type { ErrorMessageState } from '@/services/client/alert'
import type { TodoOptimisticUpdate } from '@/services/client/todo'

import { Button } from '@/components/atoms/Button'
import { Card, CardContent } from '@/components/atoms/Card'
import { Textarea } from '@/components/atoms/Textarea'
import { useErrorAlert } from '@/services/client/alert'
import { addFormAction, initTodo } from '@/services/client/todo'

const TodoAddFormContent: React.FC = () => {
  const { pending } = useFormStatus()
  return (
    <>
      <Textarea
        disabled={pending}
        name="todo"
        required
        placeholder="Add a todo"
      />
      <Button
        type="submit"
        size="icon"
        className="mt-4 min-w-10"
        disabled={pending}
        variant="primary"
      >
        <CirclePlus />
        <span className="sr-only">Submit Todo</span>
      </Button>
    </>
  )
}

interface ITodoAddFormProps {
  optimisticUpdate: TodoOptimisticUpdate
  userId: string
  maxPriority: number
}

export const TodoAddForm: React.FC<ITodoAddFormProps> = (props) => {
  const formRef = useRef<HTMLFormElement>(null)

  const [errorMessage, setErrorMessage] = useState<ErrorMessageState>(null)
  const todo = initTodo(props.userId, props.maxPriority)

  useErrorAlert(errorMessage)

  const formAction = async (data: FormData): Promise<void> => {
    addFormAction(data, todo, props.optimisticUpdate, setErrorMessage, formRef)
  }

  return (
    <Card>
      <CardContent className="p-3">
        <form action={formAction} className="flex gap-4" ref={formRef}>
          <TodoAddFormContent />
        </form>
      </CardContent>
    </Card>
  )
}
