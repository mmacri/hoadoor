import { prisma } from "@/lib/prisma"

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export const RATE_LIMITS = {
  REVIEW_SUBMISSION: { windowMs: 24 * 60 * 60 * 1000, maxRequests: 5 }, // 5 reviews per day
  POST_CREATION: { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 posts per hour
  COMMENT_CREATION: { windowMs: 60 * 60 * 1000, maxRequests: 30 }, // 30 comments per hour
  MEMBERSHIP_REQUEST: { windowMs: 24 * 60 * 60 * 1000, maxRequests: 3 }, // 3 membership requests per day
  FLAG_CONTENT: { windowMs: 60 * 60 * 1000, maxRequests: 5 }, // 5 flags per hour
  SEARCH: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 searches per minute
} as const

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<{ success: boolean; count: number; resetTime: Date }> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - config.windowMs)
  
  // Clean up old rate limit records
  await prisma.rateLimit.deleteMany({
    where: {
      resetTime: {
        lt: windowStart,
      },
    },
  })
  
  // Get or create rate limit record
  const existingLimit = await prisma.rateLimit.findUnique({
    where: { key },
  })
  
  const resetTime = new Date(now.getTime() + config.windowMs)
  
  if (!existingLimit) {
    // Create new rate limit record
    await prisma.rateLimit.create({
      data: {
        key,
        count: 1,
        resetTime,
      },
    })
    
    return {
      success: true,
      count: 1,
      resetTime,
    }
  }
  
  // Check if the existing record is within the current window
  if (existingLimit.resetTime > now) {
    // Within current window
    if (existingLimit.count >= config.maxRequests) {
      return {
        success: false,
        count: existingLimit.count,
        resetTime: existingLimit.resetTime,
      }
    }
    
    // Increment count
    const updated = await prisma.rateLimit.update({
      where: { key },
      data: {
        count: existingLimit.count + 1,
      },
    })
    
    return {
      success: true,
      count: updated.count,
      resetTime: updated.resetTime,
    }
  } else {
    // Reset the window
    const updated = await prisma.rateLimit.update({
      where: { key },
      data: {
        count: 1,
        resetTime,
      },
    })
    
    return {
      success: true,
      count: updated.count,
      resetTime: updated.resetTime,
    }
  }
}

export function getRateLimitKey(type: keyof typeof RATE_LIMITS, identifier: string, additional?: string): string {
  const base = `${type}:${identifier}`
  return additional ? `${base}:${additional}` : base
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public resetTime: Date,
    public count: number,
    public limit: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

export async function enforceRateLimit(
  type: keyof typeof RATE_LIMITS,
  identifier: string,
  additional?: string
): Promise<void> {
  const config = RATE_LIMITS[type]
  const key = getRateLimitKey(type, identifier, additional)
  
  const result = await checkRateLimit(key, config)
  
  if (!result.success) {
    throw new RateLimitError(
      `Rate limit exceeded. Try again after ${result.resetTime.toISOString()}`,
      result.resetTime,
      result.count,
      config.maxRequests
    )
  }
}
