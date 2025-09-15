'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { User, LogIn, LogOut } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AuthButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function AuthButton({ variant = 'default', size = 'default', className }: AuthButtonProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        Loading...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">
            {session.user?.name || session.user?.email}
          </span>
        </div>
        <Button
          variant={variant}
          size={size}
          onClick={() => signOut()}
          className={className}
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => signIn()}
      className={className}
    >
      <LogIn className="h-4 w-4 mr-1" />
      Sign In
    </Button>
  )
}

export function UserProfileLink({ className }: { className?: string }) {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <Link 
      href="/profile" 
      className={cn(
        "flex items-center gap-2 text-sm hover:text-primary transition-colors",
        className
      )}
    >
      <User className="h-4 w-4" />
      <span>{session.user?.name || 'Profile'}</span>
    </Link>
  )
}
