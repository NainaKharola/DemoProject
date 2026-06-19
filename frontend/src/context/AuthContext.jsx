import { useCallback, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { AuthContext } from './AuthContextObject'
import { clearSession, getStoredUser, getToken, setStoredUser, setToken } from '../utils/tokenStorage'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const isAuthLoading = false

  const persistSession = useCallback((session) => {
    setToken(session.token)
    setStoredUser(session.user)
    setUser(session.user)
  }, [])

  const login = useCallback((credentials) => authService.login(credentials), [])

  const register = useCallback((payload) => authService.register(payload), [])

  const verifyRegisterOtp = useCallback(
    async (payload) => {
      const session = await authService.verifyRegisterOtp(payload)
      persistSession(session)
      return session
    },
    [persistSession],
  )

  const verifyLoginOtp = useCallback(
    async (payload) => {
      const session = await authService.verifyLoginOtp(payload)
      persistSession(session)
      return session
    },
    [persistSession],
  )

  const refreshProfile = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      return null
    }

    try {
      const response = await authService.getProfile()
      setStoredUser(response.user)
      setUser(response.user)
      return response.user
    } catch (error) {
      clearSession()
      setUser(null)
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isAuthLoading,
      login,
      logout,
      refreshProfile,
      register,
      user,
      verifyLoginOtp,
      verifyRegisterOtp,
    }),
    [isAuthLoading, login, logout, refreshProfile, register, user, verifyLoginOtp, verifyRegisterOtp],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
