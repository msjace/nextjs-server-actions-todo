'use client'
import { useOptimistic } from 'react'

import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

import type { ITodo } from '@/common/interfaces/todo'
import type { DragEndEvent } from '@dnd-kit/core'

import { TodoAddForm } from '@/components/organisms/TodoAddForm/TodoAddForm'
import { TodoItems } from '@/components/organisms/TodoItems/TodoItems'
import { onTodoDragEnd, todoUpdateFn } from '@/services/client/todo'

interface ITodoListProps {
  todos: ITodo[]
  userId: string
}

export const TodoList: React.FC<ITodoListProps> = (props) => {
  const [optimisticTodos, optimisticTodosUpdate] = useOptimistic(
    props.todos,
    todoUpdateFn
  )

  const maxPriority =
    props.todos.length > 0 ? Math.max(...props.todos.map((t) => t.priority)) : 0

  const onDragEnd = async (event: DragEndEvent) =>
    onTodoDragEnd(event, optimisticTodos, optimisticTodosUpdate, props.todos)

  return (
    <>
      <TodoAddForm
        optimisticUpdate={optimisticTodosUpdate}
        userId={props.userId}
        maxPriority={maxPriority}
      />
      <div className="flex w-full flex-col gap-4">
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={optimisticTodos}>
            {optimisticTodos.map((item) => (
              <TodoItems
                optimisticUpdate={optimisticTodosUpdate}
                todo={item}
                userId={props.userId}
                key={item.id}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  )
}
