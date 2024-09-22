'use server'

import { revalidatePath } from 'next/cache'

import type { IAddTodo, ITodo } from '@/common/interfaces/todo'
import type { ErrorMessageState } from '@/services/client/alert'

import { Time } from '@/common/time'
import { TodoRepository } from '@/repositories/server/todo'

export async function getTodos(userId: string): Promise<ITodo[]> {
  try {
    const todos = await new TodoRepository().getTodos(userId)
    return todos
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function addTodo(todo: ITodo): Promise<ErrorMessageState> {
  try {
    if (!todo.title) {
      throw new Error('Title is required')
    }
    const todos = await new TodoRepository().getTodosByTitle(todo.title)
    if (todos.length > 0) throw new Error('Title already exist')

    const newTodo: IAddTodo = {
      user_id: todo.user_id,
      title: todo.title,
      is_completed: false,
      priority: todo.priority,
    }

    await new TodoRepository().addTodo(newTodo)
    revalidatePath('/todos')
  } catch (error: any) {
    console.error(error)
    const message = error.message
    return { errorMessage: message }
  }
  return null
}

export async function updateTodo(todo: ITodo): Promise<void> {
  try {
    todo.updated_at = Time.timeNow()

    await new TodoRepository().updateTodo(todo)
    revalidatePath('/todos')
  } catch (error) {
    console.error(error)
  }
}

export async function deleteTodo(todoId: number): Promise<void> {
  try {
    await new TodoRepository().deleteTodo(todoId)
    revalidatePath('/todos')
  } catch (error) {
    console.error(error)
  }
}

export async function updatePriorities(todoUpdates: ITodo[]): Promise<void> {
  try {
    const updatedTime = Time.timeNow()

    todoUpdates.forEach((todo) => {
      todo.updated_at = updatedTime
    })

    await new TodoRepository().updatePriorities(todoUpdates)
    revalidatePath('/todos')
  } catch (error) {
    console.error(error)
  }
}
