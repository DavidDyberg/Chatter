import { Link } from '@tanstack/react-router'
import { House, Search, MessageCircleMore, CircleUserRound } from 'lucide-react'
import { useActiveRoute } from '@/hooks/useActiveRoute'

export default function Sidebar() {
  const isActiveRoute = useActiveRoute()
  return (
    <header className="text-white pt-8">
      <h1 className="font-bold text-white text-3xl">Chatter</h1>
      <nav className="flex flex-col gap-8 pt-8">
        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/"
        >
          <House className={isActiveRoute('/') ? 'stroke-3' : 'stroke-2'} />
          <p className="text-xl">Home</p>
        </Link>

        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/explore"
        >
          <Search
            className={isActiveRoute('/explore') ? 'stroke-3' : 'stroke-2'}
          />
          <p className="text-xl">Explore</p>
        </Link>

        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/messages"
        >
          <MessageCircleMore
            className={isActiveRoute('/messages') ? 'stroke-3' : 'stroke-2'}
          />
          <p className="text-xl">Messages</p>
        </Link>

        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/profile"
        >
          <CircleUserRound
            className={isActiveRoute('/profile') ? 'stroke-3' : 'stroke-2'}
          />
          <p className="text-xl">Profile</p>
        </Link>
      </nav>
    </header>
  )
}
