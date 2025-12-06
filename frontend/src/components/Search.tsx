import React, { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function SearchTab() {
  const [query, setQuery] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // navigate to /search?q=... so the Search page handles the query
    const url = `/search?q=${encodeURIComponent(query)}`
    if (typeof window !== 'undefined') {
      // use history API for SPA navigation
      window.history.pushState({}, '', url)
      // dispatch a popstate so the Search page (which listens) can update
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex items-center bg-card/60 rounded-md shadow-sm max-w-md"
      role="search"
      aria-label="Site search"
    >
      <label htmlFor="site-search" className="sr-only">
        Search
      </label>
      <Input
        id="site-search"
        value={query}
        onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
        placeholder="Search..."
        className="w-full h-10 px-3 pr-10 rounded-md focus:outline-none focus:ring-0"
      />

      <Button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-md bg-transparent border-none shadow-none focus:outline-none"
        variant="outline"
        aria-label="Search"
      >
        <SearchIcon />
      </Button>
    </form>
  )
}
