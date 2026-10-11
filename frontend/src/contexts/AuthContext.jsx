import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, logout as apiLogout } from '../api'
import { mockUser } from '../mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isDemoUser, setIsDemoUser] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const { data } = await getMe()
      if (data && (data.email || data.id)) {
        setUser({
          ...data,
          name: data.name || data.email,
          avatar: data.picture || null,
        })
        setIsDemoUser(false)
      } else {
        // No real session — stay unauthenticated unless demo was chosen
        setUser(prev => prev?.isDemo ? prev : null)
      }
    } catch {
      // 401 = not authenticated; stay null unless already in demo mode
      setUser(prev => prev?.isDemo ? prev : null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch {}
    setUser(null)
    setIsDemoUser(false)
  }

  const loginDemo = () => {
    setUser({ ...mockUser, isDemo: true })
    setIsDemoUser(true)
  }

  useEffect(() => { refresh() }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, setUser, logout, isDemoUser, loginDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
