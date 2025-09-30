import { Link } from '@tanstack/react-router'
import { House, Search, MessageCircleMore, CircleUserRound } from 'lucide-react'

export default function Sidebar() {
  return (
    <header className="text-white pt-8">
      <h1 className="font-bold text-white text-3xl">Chatter</h1>
      <nav className="flex flex-col gap-8 pt-8">
        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/"
        >
          <House />
          <p className="text-xl">Home</p>
        </Link>

        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/explore"
        >
          <Search />
          <p className="text-xl">Explore</p>
        </Link>

        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/messages"
        >
          <MessageCircleMore />
          <p className="text-xl">Messages</p>
        </Link>

        <Link
          activeProps={{ style: { fontWeight: 600 } }}
          className="flex gap-4 items-center"
          to="/profile"
        >
          <CircleUserRound />
          <p className="text-xl">Profile</p>
        </Link>
      </nav>
    </header>
  )
}
