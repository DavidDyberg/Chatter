import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/types/types'

interface Auth0ContextType {
  isAuthenticated: boolean
  user: any
  login: () => void
  logout: () => void
  isLoading: boolean
  appUser?: User | null
  refreshAppUser: () => Promise<void>
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
      useRefreshTokens={true}
    >
      <Auth0ContextProvider>{children}</Auth0ContextProvider>
    </Auth0Provider>
  )
}

function Auth0ContextProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } =
    useAuth0()

  const [appUser, setAppUser] = useState<User | null | undefined>(undefined)

  async function refreshAppUser() {
    if (!user?.email || !user?.sub) return
    try {
      const res = await fetch(
        'https://chatter-r8i2.onrender.com/api/auth/sync',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            auth0ID: user.sub,
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
    if (!isLoading && isAuthenticated && user) {
      refreshAppUser()
    }
  }, [isLoading, isAuthenticated, user])

  const contextValue: Auth0ContextType = {
    isAuthenticated,
    user,
    login: loginWithRedirect,
    logout: () =>
      logout({ logoutParams: { returnTo: window.location.origin } }),
    isLoading,
    appUser,
    refreshAppUser,
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
