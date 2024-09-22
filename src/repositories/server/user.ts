import type { SupabaseClient, User } from '@supabase/supabase-js'

import { createClient } from '@/utils/supabase/server'

export class UserRepository {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient()
  }

  public async getUser(): Promise<User | null> {
    try {
      const { data } = await this.supabase.auth.getUser()
      return data.user
    } catch (error) {
      console.error(error)
      throw new Error('Error getting user')
    }
  }
}
