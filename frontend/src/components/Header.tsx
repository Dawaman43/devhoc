import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import SearchTab from './Search'
import { ModeToggle } from './mode-toggle'
import { useAuth } from '@/lib/auth/context'

const navlinks = [
  { to: '/', label: 'Home' },
  { to: '/categories', label: 'Categories' },
  { to: '/posts', label: 'Posts' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const displayName = user?.name || user?.email || 'Account'

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-screen border-b border-border bg-linear-to-b from-background/95 to-background/70 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-bold uppercase text-primary shadow-sm group-hover:bg-primary/15 transition-colors">
            Devhoc
          </span>
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            Labs
          </span>
          <span className="ml-1 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground group-hover:border-primary/40">
            Beta
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {navlinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-3 py-1 transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-foreground"
                activeProps={{ className: 'data-[status=active]' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-6 w-64">
            <SearchTab />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Mobile: menu button */}
          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              {menuOpen ? (
                <path
                  fillRule="evenodd"
                  d="M6.225 5.811a1 1 0 0 1 1.414 0L12 10.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 11.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 13l-4.361 4.361a1 1 0 0 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414Z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>

          {/* Search visible on mobile */}
          <div className="w-32 md:hidden">
            <SearchTab />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <ModeToggle />
            {isAuthenticated ? (
              <>
                <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                  {displayName}
                </span>
                <Link
                  to="/posts/new"
                  className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                  New post
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Continue to app
                </Link>
                <Link
                  to="/auth/register"
                  className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={closeMenu}
          />
          <div className="fixed left-0 top-0 z-50 h-full w-72 border-r border-border bg-background shadow-lg">
            <div className="flex h-16 items-center justify-between px-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-base font-semibold"
                onClick={closeMenu}
              >
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold uppercase text-primary">
                  Devhoc
                </span>
                <span className="text-muted-foreground">Labs</span>
              </Link>
              <button
                aria-label="Close menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground"
                onClick={closeMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.225 5.811a1 1 0 0 1 1.414 0L12 10.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 11.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 13l-4.361 4.361a1 1 0 0 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <nav className="px-2 py-2">
              {navlinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={closeMenu}
                  activeProps={{ className: 'bg-primary/10 text-foreground' }}
                >
                  {link.label}
                  <span className="h-2 w-2 rounded-full bg-primary/50" />
                </Link>
              ))}
            </nav>
            <div className="border-t border-border p-3">
              <div className="mb-3 flex items-center justify-center">
                <ModeToggle />
              </div>
              {isAuthenticated ? (
                <>
                  <div className="mb-2 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground">
                    Signed in as{' '}
                    <span className="font-semibold text-foreground">
                      {displayName}
                    </span>
                  </div>
                  <Link
                    to="/posts/new"
                    className="inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    onClick={closeMenu}
                  >
                    New post
                  </Link>
                  <button
                    type="button"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      closeMenu()
                      handleLogout()
                    }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="inline-flex w-full items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={closeMenu}
                  >
                    Continue to app
                  </Link>
                  <Link
                    to="/auth/register"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    onClick={closeMenu}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
