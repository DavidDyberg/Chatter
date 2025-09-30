import { useRouterState } from '@tanstack/react-router'

export function useActiveRoute() {
  const { location } = useRouterState()
  return (path: string) => location.pathname === path
}
