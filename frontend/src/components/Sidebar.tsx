import { Link } from '@tanstack/react-router'
import {
  House,
  Search,
  MessageCircleMore,
  CircleUserRound,
  LogIn,
  CircleX,
} from 'lucide-react'
import { useActiveRoute } from '@/hooks/useActiveRoute'

import { useAuth0Context } from '@/auth/auth0'

export default function Sidebar() {
  const isActiveRoute = useActiveRoute()
  const { user, login, logout } = useAuth0Context()
  return (
    <header className="text-white pt-8">
      <h1 className="font-bold text-white text-3xl">Chatter</h1>
      <nav className="flex flex-col gap-8 pt-8 text-xl">
        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/"
        >
          <House className={isActiveRoute('/') ? 'stroke-3' : 'stroke-2'} />
          <p>Home</p>
        </Link>

        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/explore"
        >
          <Search
            className={isActiveRoute('/explore') ? 'stroke-3' : 'stroke-2'}
          />
          <p>Explore</p>
        </Link>

        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/messages"
        >
          <MessageCircleMore
            className={isActiveRoute('/messages') ? 'stroke-3' : 'stroke-2'}
          />
          <p>Messages</p>
        </Link>

        {user && (
          <>
            <Link
              params={{ profileId: user?.id || '' }}
              activeProps={{ style: { fontWeight: 600 } }}
              className="flex gap-4 items-center"
              to="/profile/$profileId"
            >
              <CircleUserRound
                className={
                  isActiveRoute('/profile/$profileId') ? 'stroke-3' : 'stroke-2'
                }
              />
              <p>Profile</p>
            </Link>
            <div className="flex gap-4 items-center cursor-pointer">
              <CircleX />
              <button className="cursor-pointer" onClick={() => logout()}>
                Sign out
              </button>
            </div>
          </>
        )}
        {!user && (
          <div
            onClick={() => login()}
            className="flex gap-4 items-center cursor-pointer"
          >
            <LogIn />
            <button className="cursor-pointer">Login</button>
          </div>
        )}
      </nav>
    </header>
  )
}
