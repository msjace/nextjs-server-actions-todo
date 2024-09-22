export interface ITodo {
  id: number
  user_id: string
  title: string
  is_completed: boolean
  priority: number
  created_at: string
  updated_at: string
}

export interface IAddTodo {
  user_id: string
  title: string
  is_completed: boolean
  priority: number
}
