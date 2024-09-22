'use server'

import type { IUserPublicInfo } from '@/common/interfaces/user'

import { UserRepository } from '@/repositories/server/user'

export async function getUserPublicInfo(): Promise<IUserPublicInfo | null> {
  try {
    const user = await new UserRepository().getUser()
    if (!user) return null

    const userPublicInfo: IUserPublicInfo = {
      id: user.id,
      email: user.email ?? '',
    }

    return userPublicInfo
  } catch (error) {
    console.error(error)
    return null
  }
}
