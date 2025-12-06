import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  searchPosts,
  searchComments,
  searchUsers,
  suggest,
} from '@/lib/api/search'
import { Link } from '@tanstack/react-router'

type Tab = 'posts' | 'comments' | 'users'

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<Tab>('posts')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<{
    posts: any[]
    users: any[]
  }>({ posts: [], users: [] })
  const [selected, setSelected] = useState<number>(-1)

  useEffect(() => {
    // initialize q from URL on mount and listen for popstate so header pushState works
    try {
      const params =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search)
          : new URLSearchParams()
      const urlQ = params.get('q') || ''
      setQ(urlQ)
    } catch {}

    const onPop = () => {
      const params = new URLSearchParams(window.location.search)
      setQ(params.get('q') || '')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const tid = setTimeout(() => {
      if (!q) {
        setSuggestions({ posts: [], users: [] })
        setSelected(-1)
        return
      }
      suggest(q)
        .then((res) => {
          setSuggestions(res)
          setSelected(-1)
        })
        .catch(() => {})
    }, 200)
    return () => clearTimeout(tid)
  }, [q])

  async function doSearch(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    try {
      if (tab === 'posts') {
        const res = await searchPosts(q, { limit: 50 })
        setResults(res.items ?? [])
      } else if (tab === 'comments') {
        const res = await searchComments(q, { limit: 50 })
        setResults(res.items ?? [])
      } else {
        const res = await searchUsers(q, { limit: 50 })
        setResults(res.items ?? [])
      }
    } catch (err) {
      console.error('search error', err)
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const items = suggestionList
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1 || 0, items.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
      return
    }
    if (e.key === 'Enter') {
      if (selected >= 0 && items[selected]) {
        const it = items[selected]
        if (it.type === 'post') {
          window.location.href = `/posts/${it.id}`
        } else {
          window.location.href = `/users/${it.id}`
        }
      } else {
        void doSearch()
      }
    }
    if (e.key === 'Escape') {
      setSelected(-1)
    }
  }

  const suggestionList = useMemo(() => {
    const items: Array<{ type: string; id: string; label: string }> = []
    suggestions.posts
      ?.slice(0, 5)
      .forEach((p: any) =>
        items.push({ type: 'post', id: p.id, label: p.title }),
      )
    suggestions.users
      ?.slice(0, 5)
      .forEach((u: any) =>
        items.push({ type: 'user', id: u.id, label: u.name }),
      )
    return items
  }, [suggestions])

  return (
    <div className="space-y-4">
      <form onSubmit={doSearch} className="flex items-center gap-2">
        <Input
          value={q}
          onKeyDown={onKeyDown}
          onChange={(e) => setQ((e.target as HTMLInputElement).value)}
          placeholder="Search posts, comments, users..."
        />
        <Button type="submit" disabled={loading}>
          Search
        </Button>
      </form>

      {q && suggestionList.length > 0 && (
        <div className="border rounded-md p-2 bg-card">
          <div className="text-xs text-muted-foreground mb-1">Suggestions</div>
          <ul className="space-y-1">
            {suggestionList.map((s, idx) => (
              <li
                key={`${s.type}-${s.id}`}
                className={idx === selected ? 'bg-muted/40 rounded-sm' : ''}
              >
                {s.type === 'post' ? (
                  <a
                    href={`/posts/${s.id}`}
                    className="text-sm hover:underline block py-0.5 px-1"
                  >
                    {s.label}
                  </a>
                ) : (
                  <a
                    href={`/users/${s.id}`}
                    className="text-sm hover:underline block py-0.5 px-1"
                  >
                    {s.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded ${tab === 'posts' ? 'bg-accent' : ''}`}
          onClick={() => setTab('posts')}
        >
          Posts
        </button>
        <button
          className={`px-3 py-1 rounded ${tab === 'comments' ? 'bg-accent' : ''}`}
          onClick={() => setTab('comments')}
        >
          Comments
        </button>
        <button
          className={`px-3 py-1 rounded ${tab === 'users' ? 'bg-accent' : ''}`}
          onClick={() => setTab('users')}
        >
          Users
        </button>
      </div>

      <div>
        {loading && <div>Loading...</div>}
        {!loading && results.length === 0 && (
          <div className="text-muted-foreground">No results</div>
        )}
        <ul className="space-y-3">
          {results.map((r) => (
            <li key={r.id} className="border rounded p-3 bg-card">
              {tab === 'posts' && (
                <div>
                  <Link
                    to={`/posts/${r.id}`}
                    className="font-semibold hover:underline"
                  >
                    {r.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    by {r.authorName}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {r.content}
                  </p>
                </div>
              )}
              {tab === 'comments' && (
                <div>
                  <div className="text-xs text-muted-foreground">
                    by {r.authorName}
                  </div>
                  <p className="mt-1 text-sm">{r.text}</p>
                  <div className="mt-2 text-xs">
                    <Link to={`/posts/${r.postId}`}>View post</Link>
                  </div>
                </div>
              )}
              {tab === 'users' && (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.reputation} rep
                    </div>
                  </div>
                  <div>
                    <Link to={`/profile`} className="px-3 py-1 rounded border">
                      View
                    </Link>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
