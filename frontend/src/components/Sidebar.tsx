import { Link } from '@tanstack/react-router'

export default function Sidebar() {
  return (
    <header className="text-white">
      <nav>
        <div className=" font-bold">
          <Link to="/">Home</Link>
        </div>
        <div className="font-bold">
          <Link to="/explore">Explore</Link>
        </div>
        <div className=" font-bold">
          <Link to="/messages">Messages</Link>
        </div>
        <div className=" font-bold">
          <Link to="/profile">Profile</Link>
        </div>
      </nav>
    </header>
  )
}
