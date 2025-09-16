'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { UserPlus, Loader2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface JoinCommunityButtonProps {
  hoaId: string
  hoaName: string
}

export function JoinCommunityButton({ hoaId, hoaName }: JoinCommunityButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [requested, setRequested] = useState(false)

  const handleJoin = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/memberships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hoaId,
          note: `Request to join ${hoaName} community`
        })
      })

      if (response.ok) {
        setRequested(true)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to send membership request')
      }
    } catch (error) {
      console.error('Error joining community:', error)
      alert('Failed to send membership request')
    } finally {
      setLoading(false)
    }
  }

  if (requested) {
    return (
      <Button disabled className="w-full">
        <Check className="h-4 w-4 mr-2" />
        Request Sent
      </Button>
    )
  }

  return (
    <Button onClick={handleJoin} disabled={loading} className="w-full">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <UserPlus className="h-4 w-4 mr-2" />
      )}
      {session ? 'Join Community' : 'Sign In to Join'}
    </Button>
  )
}
