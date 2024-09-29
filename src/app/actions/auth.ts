'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type { ErrorMessageState } from '@/services/client/alert'
import type {
  Session,
  SignInWithPasswordCredentials,
} from '@supabase/supabase-js'

import { StringUtil } from '@/common/util_string'
import { createClient } from '@/utils/supabase/server'

export async function login(
  previousState: ErrorMessageState,
  formData: FormData
): Promise<ErrorMessageState> {
  const supabase = createClient()

  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return {
        ...previousState,
        errorMessage: 'Email and password are required',
      }
    }

    const credentials: SignInWithPasswordCredentials = {
      email,
      password,
    }

    const { error } = await supabase.auth.signInWithPassword(credentials)
    if (error) throw new Error(error.message)
  } catch (error: any) {
    console.log(error)
    const message = StringUtil.parseSupabaseError(error)
    return { ...previousState, errorMessage: message }
  }
  redirect('/todos')
}

export async function signup(
  previousState: ErrorMessageState,
  formData: FormData
): Promise<ErrorMessageState> {
  const supabase = createClient()

  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)
    if (error) throw new Error()
  } catch (error: any) {
    console.log(error)
    const message = StringUtil.parseSupabaseError(error)
    return { ...previousState, errorMessage: message }
  }
  revalidatePath('/', 'layout')
  redirect('/login?email_verification_required')
}

export async function signOut(): Promise<void> {
  const supabase = createClient()

  await supabase.auth.signOut()
  redirect('/login')
}

export async function getSession(): Promise<Session | null> {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function verifyEmail(token: string): Promise<string | null> {
  const supabase = createClient()

  const { error } = await supabase.auth.verifyOtp({
    type: 'signup',
    token_hash: token,
  })
  if (error) {
    const message = StringUtil.parseSupabaseError(error)
    return message
  }

  await supabase.auth.signOut()
  return null
}
