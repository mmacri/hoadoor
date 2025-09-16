'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Edit3, Loader2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/StarRating'
import { Checkbox } from '@/components/ui/checkbox'

interface WriteReviewButtonProps {
  hoaId: string
  hoaName: string
}

export function WriteReviewButton({ hoaId, hoaName }: WriteReviewButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [stars, setStars] = useState(5)
  const [text, setText] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hoaId,
          stars,
          text: text.trim() || undefined,
          isAnonymous
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setOpen(false)
          setSubmitted(false)
          setStars(5)
          setText('')
          setIsAnonymous(false)
        }, 2000)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => router.push('/auth/signin')}
      >
        <Edit3 className="h-4 w-4 mr-2" />
        Sign In to Review
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Edit3 className="h-4 w-4 mr-2" />
          Write Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {hoaName}
          </DialogDescription>
        </DialogHeader>
        
        {submitted ? (
          <div className="text-center py-6">
            <Check className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Review Submitted!</h3>
            <p className="text-muted-foreground">
              Your review is pending approval and will appear shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="mt-2">
                <StarRating
                  rating={stars}
                  interactive
                  onRatingChange={setStars}
                  size="lg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="review-text">Review (Optional)</Label>
              <Textarea
                id="review-text"
                placeholder="Share your experience with this HOA..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={2000}
                className="mt-2"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {text.length}/2000 characters
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous" className="text-sm">
                Post anonymously
              </Label>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Submit Review
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
