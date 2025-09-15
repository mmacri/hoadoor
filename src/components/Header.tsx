import Link from 'next/link'
import { AuthButton } from './AuthButton'
import { Search, Home } from 'lucide-react'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">HOAdoor</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/search" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Browse HOAs
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/search">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </Link>
          
          <AuthButton variant="outline" size="sm" />
        </div>
      </div>
    </header>
  )
}
