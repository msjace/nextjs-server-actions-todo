import type { IAddTodo, ITodo } from '@/common/interfaces/todo'
import type { SupabaseClient } from '@supabase/supabase-js'

import { createClient } from '@/utils/supabase/server'

export class TodoRepository {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient()
  }

  public async getTodos(userId: string): Promise<ITodo[]> {
    const { data: todos, error } = await this.supabase
      .from('todos')
      .select()
      .eq('user_id', userId)
      .order('priority', { ascending: true })

    if (error) {
      console.error(error)
      throw new Error('Error gettting todos')
    }

    return todos as ITodo[]
  }

  public async addTodo(todo: IAddTodo): Promise<void> {
    const { error } = await this.supabase.from('todos').insert(todo)
    if (error) {
      console.error(error)
      throw new Error('Error adding task')
    }
  }

  public async updateTodo(todo: ITodo): Promise<void> {
    const { error } = await this.supabase.from('todos').update(todo).match({
      id: todo.id,
    })

    if (error) {
      console.error(error)
      throw new Error('Error updating task')
    }
  }

  public async deleteTodo(todoId: number): Promise<void> {
    const { error } = await this.supabase.from('todos').delete().match({
      id: todoId,
    })

    if (error) {
      console.error(error)
      throw new Error('Error deleting task')
    }
  }

  public async getTodosByTitle(title: string): Promise<ITodo[]> {
    const { data: todos, error } = await this.supabase
      .from('todos')
      .select()
      .eq('title', title)

    if (error) {
      console.error(error)
      throw new Error('Error getting todo by title')
    }

    return todos as ITodo[]
  }

  public async updatePriorities(todoUpdates: ITodo[]): Promise<void> {
    const { error } = await this.supabase.rpc('update_todos_priorities', {
      todo_updates: todoUpdates,
    })

    if (error) {
      console.error(error)
      throw new Error('Error updating priorities')
    }
  }
}
