import { Link, useLocation } from "react-router-dom"
import { ThemeToggle } from "./ThemeToggle"

export function Nav() {
  const location = useLocation()

  const links = [
    { to: "/", label: "Gallery" },
    { to: "/collections", label: "Collections" },
    { to: "/about", label: "About" },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          to="/"
          className="font-serif text-xl tracking-tight text-neutral-900 dark:text-white"
        >
          audrey's photos
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition-colors ${
                location.pathname === link.to ||
                (link.to !== "/" && location.pathname.startsWith(link.to))
                  ? "text-neutral-900 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
