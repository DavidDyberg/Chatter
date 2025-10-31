import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@/types/types'

interface CombinedUser extends Partial<User> {
  email?: string
  name?: string
  picture?: string
  auth0ID?: string
}

interface Auth0ContextType {
  isAuthenticated: boolean
  user: CombinedUser | null
  login: () => void
  logout: () => void
  isLoading: boolean
  refreshAppUser: () => Promise<void>
  isUserMe: (id: string | undefined) => boolean
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined)

export function Auth0Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://dev-cjzvm88dsutamr5k.eu.auth0.com/api/v2/',
      }}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      <Auth0ContextProvider>{children}</Auth0ContextProvider>
    </Auth0Provider>
  )
}

function Auth0ContextProvider({ children }: { children: React.ReactNode }) {
  const {
    isAuthenticated,
    user: auth0User,
    loginWithRedirect,
    logout,
    isLoading,
  } = useAuth0()

  const [appUser, setAppUser] = useState<User | null>(null)

  async function refreshAppUser() {
    if (!auth0User?.email || !auth0User?.sub) return
    try {
      const res = await fetch(
        'https://chatter-r8i2.onrender.com/api/auth/sync',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: auth0User.email,
            name: auth0User.name,
            auth0ID: auth0User.sub,
          }),
        },
      )
      if (res.ok) {
        const json = await res.json()
        setAppUser(json)
      } else {
        console.error('Failed to sync user', await res.text())
      }
    } catch (err) {
      console.error('Sync error', err)
    }
  }

  useEffect(() => {
    if (!isLoading && isAuthenticated && auth0User) {
      refreshAppUser()
    }
  }, [isLoading, isAuthenticated, auth0User])

  const combinedUser = useMemo<CombinedUser | null>(() => {
    if (!auth0User && !appUser) return null
    return {
      ...appUser,
      name: auth0User?.name,
      picture: auth0User?.picture,
      auth0ID: auth0User?.sub,
    }
  }, [auth0User, appUser])

  const isUserMe = (id: string | undefined): boolean => {
    if (!id || !combinedUser) return false
    return (
      id === combinedUser.id ||
      id === combinedUser.auth0ID ||
      id === combinedUser.email
    )
  }

  const contextValue: Auth0ContextType = {
    isAuthenticated,
    user: combinedUser,
    login: () => loginWithRedirect(),
    logout: () =>
      logout({ logoutParams: { returnTo: window.location.origin } }),
    isLoading,
    refreshAppUser,
    isUserMe,
  }

  return (
    <Auth0Context.Provider value={contextValue}>
      {children}
    </Auth0Context.Provider>
  )
}

export function useAuth0Context() {
  const context = useContext(Auth0Context)
  if (context === undefined) {
    throw new Error('useAuth0Context must be used within Auth0Wrapper')
  }
  return context
}
