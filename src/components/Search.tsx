import { Search } from 'lucide-react'
import { Input } from './ui/input'

export function SearchBar() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="search" placeholder="Search..." className="pl-10 pr-4" />
    </div>
  )
}
