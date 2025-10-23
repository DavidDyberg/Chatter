import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import Sidebar from '../components/Sidebar'
import type { QueryClient } from '@tanstack/react-query'
import BottomTabBar from '../components/BottomTabBar'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <div className="md:grid min-h-screen md:grid-cols-[230px_1fr] md:px-20">
        <aside className="hidden md:block md:border-r md:border-gray-800">
          <Sidebar />
        </aside>
        <main className='pb-20 md:pb-0"'>
          <Outlet />
        </main>
        <BottomTabBar />
      </div>

      <TanStackRouterDevtools />

      <TanStackQueryLayout />
    </>
  ),
})
