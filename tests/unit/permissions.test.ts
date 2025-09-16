import { describe, it, expect, vi } from 'vitest'
import { 
  isHOAMember, 
  isHOAAdmin, 
  canModerateHOAContent,
  isPlatformAdmin,
  requireAuth
} from '@/server/permissions'

// Mock Prisma
const mockPrisma = {
  membership: {
    findUnique: vi.fn()
  }
}

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma
}))

describe('Permissions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isHOAMember', () => {
    it('should return true for approved member', async () => {
      mockPrisma.membership.findUnique.mockResolvedValue({
        userId: 'user-1',
        hoaId: 'hoa-1',
        status: 'APPROVED',
        role: 'MEMBER'
      })

      const result = await isHOAMember('user-1', 'hoa-1')
      expect(result).toBe(true)
    })

    it('should return false for pending member', async () => {
      mockPrisma.membership.findUnique.mockResolvedValue({
        userId: 'user-1',
        hoaId: 'hoa-1',
        status: 'PENDING',
        role: 'MEMBER'
      })

      const result = await isHOAMember('user-1', 'hoa-1')
      expect(result).toBe(false)
    })

    it('should return false for non-member', async () => {
      mockPrisma.membership.findUnique.mockResolvedValue(null)

      const result = await isHOAMember('user-1', 'hoa-1')
      expect(result).toBe(false)
    })
  })

  describe('isHOAAdmin', () => {
    it('should return true for HOA admin', async () => {
      mockPrisma.membership.findUnique.mockResolvedValue({
        userId: 'user-1',
        hoaId: 'hoa-1',
        status: 'APPROVED',
        role: 'ADMIN'
      })

      const result = await isHOAAdmin('user-1', 'hoa-1')
      expect(result).toBe(true)
    })

    it('should return true for HOA president', async () => {
      mockPrisma.membership.findUnique.mockResolvedValue({
        userId: 'user-1',
        hoaId: 'hoa-1',
        status: 'APPROVED',
        role: 'PRESIDENT'
      })

      const result = await isHOAAdmin('user-1', 'hoa-1')
      expect(result).toBe(true)
    })

    it('should return false for regular member', async () => {
      mockPrisma.membership.findUnique.mockResolvedValue({
        userId: 'user-1',
        hoaId: 'hoa-1',
        status: 'APPROVED',
        role: 'MEMBER'
      })

      const result = await isHOAAdmin('user-1', 'hoa-1')
      expect(result).toBe(false)
    })
  })

  describe('isPlatformAdmin', () => {
    it('should return true for platform admin', () => {
      const user = {
        id: 'user-1',
        email: 'admin@test.com',
        roles: ['PLATFORM_ADMIN']
      }

      const result = isPlatformAdmin(user)
      expect(result).toBe(true)
    })

    it('should return false for regular user', () => {
      const user = {
        id: 'user-1',
        email: 'user@test.com',
        roles: []
      }

      const result = isPlatformAdmin(user)
      expect(result).toBe(false)
    })
  })

  describe('requireAuth', () => {
    it('should return user when authenticated', () => {
      const user = {
        id: 'user-1',
        email: 'user@test.com',
        roles: []
      }

      const result = requireAuth(user)
      expect(result).toEqual(user)
    })

    it('should throw error when not authenticated', () => {
      expect(() => requireAuth(null)).toThrow('Authentication required')
    })
  })
})
