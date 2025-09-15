'use client'

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  interactive = false, 
  onRatingChange,
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= rating
        const isHalfFilled = starValue - 0.5 <= rating && starValue > rating

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starValue)}
            className={cn(
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
              interactive && "hover:scale-110 transition-transform cursor-pointer",
              !interactive && "cursor-default"
            )}
            aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled || isHalfFilled 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-muted-foreground"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export function AverageRating({ 
  rating, 
  count, 
  size = 'md',
  showCount = true,
  className 
}: { 
  rating: number
  count: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  className?: string 
}) {
  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <StarRating rating={rating} size={size} />
      <span className={cn("font-medium", textSize[size])}>
        {rating.toFixed(1)}
      </span>
      {showCount && (
        <span className={cn("text-muted-foreground", textSize[size])}>
          ({count} review{count !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  )
}
