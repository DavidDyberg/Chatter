import { Link } from '@tanstack/react-router'
import { House, Search, MessageCircleMore, CircleUserRound } from 'lucide-react'

export default function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-primary-black py-3 text-white md:hidden">
      <Link
        activeProps={{ className: 'font-bold' }}
        to="/"
        className="flex flex-col items-center gap-1"
      >
        <House strokeWidth={3} />
        <span className="text-xs min-w-10 text-center">Home</span>
      </Link>
      <Link
        activeProps={{ style: { fontWeight: 600 } }}
        to="/explore"
        className="flex flex-col items-center gap-1"
      >
        <Search />
        <span className="text-xs min-w-10 text-center">Explore</span>
      </Link>
      <Link
        activeProps={{ style: { fontWeight: 600 } }}
        to="/messages"
        className="flex flex-col items-center gap-1"
      >
        <MessageCircleMore />
        <span className="text-xs min-w-10 text-center">Messages</span>
      </Link>
      <Link
        activeProps={{ style: { fontWeight: 600 } }}
        to="/profile"
        className="flex flex-col items-center gap-1"
      >
        <CircleUserRound />
        <span className="text-xs min-w-10 text-center">Profile</span>
      </Link>
    </nav>
  )
}
