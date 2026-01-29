import { useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface AuthState {
  user: User | null
  loading: boolean
  error: AuthError | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        loading: false,
        error: null
      })
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        loading: false,
        error: null
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, displayName?: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0]
        }
      }
    })

    if (error) {
      setAuthState((prev) => ({ ...prev, loading: false, error }))
      return { data: null, error }
    }

    setAuthState({
      user: data.user,
      loading: false,
      error: null
    })

    return { data, error: null }
  }

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setAuthState((prev) => ({ ...prev, loading: false, error }))
      return { data: null, error }
    }

    setAuthState({
      user: data.user,
      loading: false,
      error: null
    })

    return { data, error: null }
  }

  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))

    const { error } = await supabase.auth.signOut()

    if (error) {
      setAuthState((prev) => ({ ...prev, loading: false, error }))
      return { error }
    }

    setAuthState({
      user: null,
      loading: false,
      error: null
    })

    return { error: null }
  }

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    signOut
  }
}
