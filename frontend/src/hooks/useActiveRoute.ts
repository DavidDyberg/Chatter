import { useRouterState, type LinkProps } from '@tanstack/react-router'

export function useActiveRoute() {
  const { location } = useRouterState()
  return (path: LinkProps['to']) => location.pathname === path
}
