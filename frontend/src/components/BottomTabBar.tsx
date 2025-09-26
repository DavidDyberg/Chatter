import { Link } from '@tanstack/react-router'
import { House, Search, MessageCircleMore, CircleUserRound } from 'lucide-react'

export default function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-black py-3 text-white md:hidden border-t border-gray-800">
      <Link to="/" className="flex flex-col items-center gap-1">
        <House />
        <span className="text-xs">Home</span>
      </Link>
      <Link to="/explore" className="flex flex-col items-center gap-1">
        <Search />
        <span className="text-xs">Explore</span>
      </Link>
      <Link to="/messages" className="flex flex-col items-center gap-1">
        <MessageCircleMore />
        <span className="text-xs">Messages</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center gap-1">
        <CircleUserRound />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  )
}
