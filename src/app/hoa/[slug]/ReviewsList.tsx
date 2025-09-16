'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/StarRating'
import { formatRelativeTime } from '@/lib/utils'
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'

interface Review {
  id: string
  stars: number
  text: string | null
  createdAt: Date
  isAnonymous: boolean
  user: {
    id: string
    name: string | null
  } | null
  adminResponses: {
    id: string
    text: string
    createdAt: Date
    responder: {
      id: string
      name: string | null
    }
  }[]
}

interface ReviewsListProps {
  hoaId: string
  initialReviews: Review[]
}

export function ReviewsList({ hoaId, initialReviews }: ReviewsListProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialReviews.length >= 10)
  const [page, setPage] = useState(1)
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())

  const loadMoreReviews = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reviews?hoaId=${hoaId}&page=${page + 1}&limit=10`)
      
      if (response.ok) {
        const data = await response.json()
        setReviews(prev => [...prev, ...data.reviews])
        setPage(page + 1)
        setHasMore(data.pagination.hasMore)
      }
    } catch (error) {
      console.error('Failed to load more reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId)
    } else {
      newExpanded.add(reviewId)
    }
    setExpandedReviews(newExpanded)
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground">
            Be the first to share your experience with this HOA community.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const isExpanded = expandedReviews.has(review.id)
        const hasLongText = review.text && review.text.length > 300
        const displayText = hasLongText && !isExpanded 
          ? review.text!.substring(0, 300) + '...' 
          : review.text

        return (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.stars} size="sm" />
                    <Badge variant="outline" className="text-xs">
                      {formatRelativeTime(review.createdAt)}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">
                    {review.isAnonymous ? 'Anonymous' : (review.user?.name || 'Anonymous')}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            {review.text && (
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {displayText}
                </p>
                
                {hasLongText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(review.id)}
                    className="h-auto p-0 text-primary hover:text-primary/80"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show More
                      </>
                    )}
                  </Button>
                )}

                {/* Admin Responses */}
                {review.adminResponses.map((response) => (
                  <div
                    key={response.id}
                    className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-200 rounded-r-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        HOA Response
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(response.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>{response.responder.name}</strong>
                    </p>
                    <p className="text-sm leading-relaxed">
                      {response.text}
                    </p>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        )
      })}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={loadMoreReviews}
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </Button>
        </div>
      )}
    </div>
  )
}
