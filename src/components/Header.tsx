import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { SearchBar } from './Search'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { id: 1, name: 'Home', to: '/' },
  { id: 2, name: 'Categories', to: '/categories' },
  { id: 3, name: 'Contact', to: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10  shadow-[0_0_45px_rgba(15,23,42,0.45)] backdrop-blur-lg p-4">
      <div className="container relative flex h-16 max-w-screen-2xl items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span
              className="text-3xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "'Ethnocentric', 'Orbitron', sans-serif" }}
            >
              DevHoc
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground shadow-inner">
              Labs
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                aria-hidden
              />
            </span>
          </Link>
        </div>

        <div className="text-[10px] border p-1 border-green-500 rounded-2xl">
          beta
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-3 text-sm font-medium lg:flex ">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.to}
              className="relative overflow-hidden rounded-xl px-3 py-1 text-sm font-semibold text-slate-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 hover:bg-accent"
            >
              <span className="relative z-10">{link.name}</span>
              <span className="absolute inset-0 -translate-y-full bg-gradient-to-r from-emerald-500/40 via-emerald-500/20 to-sky-500/40 transition-transform duration-300 group-hover:translate-y-0" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <SearchBar />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Button
              size="sm"
              className="rounded-full p-4 font-semibold shadow-emerald-500/30 cursor-pointer"
            >
              Launch App
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-slate-200 p-4 font-semibold shadow-emerald-500/30 cursor-pointer"
            >
              Register
            </Button>
          </div>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/70 lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <span className="text-lg font-semibold">×</span>
            ) : (
              <span className="space-y-1">
                <span className="block h-0.5 w-5 bg-current"></span>
                <span className="block h-0.5 w-5 bg-current"></span>
                <span className="block h-0.5 w-5 bg-current"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-white/10 bg-slate-900/90 transition-all duration-200 lg:hidden',
          mobileMenuOpen ? 'max-h-[520px] pb-6' : 'max-h-0',
        )}
      >
        <div className="space-y-4 px-4 pt-5">
          <div className="rounded-2xl bg-white/5 p-3 backdrop-blur">
            <SearchBar />
          </div>
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.to}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-emerald-500/60 hover:bg-emerald-500/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-full border-white/30 text-white"
            >
              Register
            </Button>
            <Button className="flex-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white">
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
