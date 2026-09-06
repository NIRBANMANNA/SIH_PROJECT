// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Local fallback session so the app works seamlessly even before adding Supabase keys
      const stored = localStorage.getItem('kisandarpan_user')
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch {
          // ignore corrupted json
        }
      }
      setLoading(false)
      return
    }

    // Real Supabase Session Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sign in with Email & Password
  const signInWithEmail = async (email, password) => {
    if (!isSupabaseConfigured) {
      // Instant dev authentication
      await new Promise(r => setTimeout(r, 600))
      
      let existingFullName = ''
      try {
        const stored = localStorage.getItem('kisandarpan_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed?.email === email && parsed?.user_metadata?.full_name) {
            existingFullName = parsed.user_metadata.full_name
          }
        }
      } catch {}

      const devUser = {
        id: 'dev-user-01',
        email,
        user_metadata: { full_name: existingFullName || email.split('@')[0] },
      }
      localStorage.setItem('kisandarpan_user', JSON.stringify(devUser))
      setUser(devUser)
      return { data: { user: devUser }, error: null }
    }

    return await supabase.auth.signInWithPassword({ email, password })
  }

  // Sign up with Name, Email & Password
  const signUpWithEmail = async (email, password, fullName) => {
    if (!isSupabaseConfigured) {
      await new Promise(r => setTimeout(r, 600))
      const devUser = {
        id: 'dev-user-' + Date.now(),
        email,
        user_metadata: { full_name: fullName || email.split('@')[0] },
      }
      localStorage.setItem('kisandarpan_user', JSON.stringify(devUser))
      setUser(devUser)
      return { data: { user: devUser }, error: null }
    }

    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
  }

  // 1-Click Google OAuth
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      // Prompt user or simulate instant Google account
      const devUser = {
        id: 'google-user-' + Date.now(),
        email: 'farmer.demo@gmail.com',
        user_metadata: { full_name: 'Farmer (Google)' },
      }
      localStorage.setItem('kisandarpan_user', JSON.stringify(devUser))
      setUser(devUser)
      return { error: null }
    }

    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  // Update User Profile (Name, Email, Metadata)
  const updateUserProfile = async ({ fullName, email: newEmail }) => {
    const updatedMeta = { ...(user?.user_metadata || {}), full_name: fullName }
    const updatedUser = {
      ...(user || {}),
      email: newEmail || user?.email,
      user_metadata: updatedMeta
    }

    localStorage.setItem('kisandarpan_user', JSON.stringify(updatedUser))
    setUser(updatedUser)

    if (isSupabaseConfigured) {
      const updates = { data: { full_name: fullName } }
      if (newEmail && newEmail !== user?.email) {
        updates.email = newEmail
      }
      return await supabase.auth.updateUser(updates)
    }

    return { data: { user: updatedUser }, error: null }
  }

  // Sign Out
  const signOut = async () => {
    localStorage.removeItem('kisandarpan_user')
    setUser(null)
    setSession(null)
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        updateUserProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
