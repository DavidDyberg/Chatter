import { useActiveRoute } from '@/hooks/useActiveRoute'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from '@tanstack/react-router'
import {
  House,
  Search,
  MessageCircleMore,
  CircleUserRound,
  LogIn,
} from 'lucide-react'

export default function BottomTabBar() {
  const isActiveRoute = useActiveRoute()
  const { user, loginWithRedirect } = useAuth0()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-primary-black py-3 text-white md:hidden text-xs">
      <Link to="/" className="flex flex-col items-center gap-1">
        <House className={isActiveRoute('/') ? 'stroke-2' : 'stroke-1'} />
        <span>Home</span>
      </Link>
      <Link to="/explore" className="flex flex-col items-center gap-1">
        <Search
          className={isActiveRoute('/explore') ? 'stroke-2' : 'stroke-1'}
        />
        <span>Explore</span>
      </Link>
      <Link to="/messages" className="flex flex-col items-center gap-1">
        <MessageCircleMore
          className={isActiveRoute('/messages') ? 'stroke-2' : 'stroke-1'}
        />
        <span>Messages</span>
      </Link>

      {!user && (
        <div
          onClick={() => loginWithRedirect()}
          className="flex flex-col items-center gap-1"
        >
          <LogIn className="stroke-1" />
          <button>Login</button>
        </div>
      )}
      {user && (
        <Link
          to="/profile/$profileId"
          className="flex flex-col items-center gap-1"
        >
          <CircleUserRound
            className={isActiveRoute('/profile') ? 'stroke-2' : 'stroke-1'}
          />
          <span>Profile</span>
        </Link>
      )}
    </nav>
  )
}
