import { useRouterState, type LinkProps } from '@tanstack/react-router'

export function useActiveRoute() {
  const { location } = useRouterState()

  return (path: LinkProps['to']) => {
    if (location.pathname === path) return true
    if (
      path === '/profile/$profileId' &&
      location.pathname.startsWith('/profile/')
    ) {
      return true
    }

    return false
  }
}
