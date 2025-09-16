import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { checkRateLimit, enforceRateLimit, RATE_LIMITS } from '@/server/ratelimit'

// Mock Prisma
const mockPrisma = {
  rateLimit: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deleteMany: vi.fn()
  }
}

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma
}))

describe('Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('checkRateLimit', () => {
    it('should allow request when no existing limit', async () => {
      mockPrisma.rateLimit.findUnique.mockResolvedValue(null)
      mockPrisma.rateLimit.create.mockResolvedValue({
        key: 'test-key',
        count: 1,
        resetTime: new Date()
      })

      const result = await checkRateLimit('test-key', RATE_LIMITS.SEARCH)

      expect(result.success).toBe(true)
      expect(result.count).toBe(1)
      expect(mockPrisma.rateLimit.create).toHaveBeenCalledWith({
        data: {
          key: 'test-key',
          count: 1,
          resetTime: expect.any(Date)
        }
      })
    })

    it('should increment count when within window', async () => {
      const futureTime = new Date(Date.now() + 10000) // 10 seconds in future
      mockPrisma.rateLimit.findUnique.mockResolvedValue({
        key: 'test-key',
        count: 5,
        resetTime: futureTime
      })
      mockPrisma.rateLimit.update.mockResolvedValue({
        key: 'test-key',
        count: 6,
        resetTime: futureTime
      })

      const result = await checkRateLimit('test-key', RATE_LIMITS.SEARCH)

      expect(result.success).toBe(true)
      expect(result.count).toBe(6)
      expect(mockPrisma.rateLimit.update).toHaveBeenCalledWith({
        where: { key: 'test-key' },
        data: { count: 6 }
      })
    })

    it('should reject when rate limit exceeded', async () => {
      const futureTime = new Date(Date.now() + 10000)
      mockPrisma.rateLimit.findUnique.mockResolvedValue({
        key: 'test-key',
        count: 100, // At limit for SEARCH
        resetTime: futureTime
      })

      const result = await checkRateLimit('test-key', RATE_LIMITS.SEARCH)

      expect(result.success).toBe(false)
      expect(result.count).toBe(100)
      expect(mockPrisma.rateLimit.update).not.toHaveBeenCalled()
    })
  })

  describe('enforceRateLimit', () => {
    it('should throw RateLimitError when limit exceeded', async () => {
      const futureTime = new Date(Date.now() + 10000)
      mockPrisma.rateLimit.findUnique.mockResolvedValue({
        key: 'SEARCH:user-123',
        count: 100,
        resetTime: futureTime
      })

      await expect(
        enforceRateLimit('SEARCH', 'user-123')
      ).rejects.toThrow('Rate limit exceeded')
    })

    it('should not throw when under limit', async () => {
      mockPrisma.rateLimit.findUnique.mockResolvedValue(null)
      mockPrisma.rateLimit.create.mockResolvedValue({
        key: 'SEARCH:user-123',
        count: 1,
        resetTime: new Date()
      })

      await expect(
        enforceRateLimit('SEARCH', 'user-123')
      ).resolves.not.toThrow()
    })
  })
})
