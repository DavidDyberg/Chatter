import { useActiveRoute } from '@/hooks/useActiveRoute'
import { Link } from '@tanstack/react-router'
import { House, Search, MessageCircleMore, CircleUserRound } from 'lucide-react'

export default function BottomTabBar() {
  const isActiveRoute = useActiveRoute()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-primary-black py-3 text-white md:hidden">
      <Link to="/" className="flex flex-col items-center gap-1">
        <House className={isActiveRoute('/') ? 'stroke-2' : 'stroke-1'} />
        <span className="text-xs min-w-10 text-center">Home</span>
      </Link>
      <Link to="/explore" className="flex flex-col items-center gap-1">
        <Search
          className={isActiveRoute('/explore') ? 'stroke-2' : 'stroke-1'}
        />
        <span className="text-xs min-w-10 text-center">Explore</span>
      </Link>
      <Link to="/messages" className="flex flex-col items-center gap-1">
        <MessageCircleMore
          className={isActiveRoute('/messages') ? 'stroke-2' : 'stroke-1'}
        />
        <span className="text-xs min-w-10 text-center">Messages</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center gap-1">
        <CircleUserRound
          className={isActiveRoute('/profile') ? 'stroke-2' : 'stroke-1'}
        />
        <span className="text-xs min-w-10 text-center">Profile</span>
      </Link>
    </nav>
  )
}
