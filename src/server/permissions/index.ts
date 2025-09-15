import { Session } from "next-auth"
import { prisma } from "@/lib/prisma"

export type UserRole = 'PLATFORM_ADMIN'
export type MembershipRole = 'MEMBER' | 'ADMIN' | 'PRESIDENT'

export interface ExtendedSession extends Session {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    roles: string[]
  }
}

export async function getSessionUser(session: Session | null): Promise<ExtendedSession['user'] | null> {
  if (!session?.user?.id) return null
  return session.user as ExtendedSession['user']
}

export async function getUserMembership(userId: string, hoaId: string) {
  return await prisma.membership.findUnique({
    where: {
      userId_hoaId: {
        userId,
        hoaId,
      },
    },
  })
}

export async function isHOAMember(userId: string, hoaId: string): Promise<boolean> {
  const membership = await getUserMembership(userId, hoaId)
  return membership?.status === 'APPROVED'
}

export async function isHOAAdmin(userId: string, hoaId: string): Promise<boolean> {
  const membership = await getUserMembership(userId, hoaId)
  return membership?.status === 'APPROVED' && 
         (membership.role === 'ADMIN' || membership.role === 'PRESIDENT')
}

export async function isHOAPresident(userId: string, hoaId: string): Promise<boolean> {
  const membership = await getUserMembership(userId, hoaId)
  return membership?.status === 'APPROVED' && membership.role === 'PRESIDENT'
}

export function isPlatformAdmin(user: ExtendedSession['user']): boolean {
  return user.roles.includes('PLATFORM_ADMIN')
}

export async function canViewHOAPrivateContent(userId: string, hoaId: string): Promise<boolean> {
  return await isHOAMember(userId, hoaId)
}

export async function canModerateHOAContent(userId: string, hoaId: string): Promise<boolean> {
  return await isHOAAdmin(userId, hoaId)
}

export async function canManageHOAMembers(userId: string, hoaId: string): Promise<boolean> {
  return await isHOAAdmin(userId, hoaId)
}

export async function canEditHOASettings(userId: string, hoaId: string): Promise<boolean> {
  return await isHOAAdmin(userId, hoaId)
}

export async function canCreateHOAContent(userId: string, hoaId: string): Promise<boolean> {
  return await isHOAMember(userId, hoaId)
}

export async function canReplyToReview(userId: string, hoaId: string): Promise<boolean> {
  return await isHOAAdmin(userId, hoaId)
}

export async function canViewAnalytics(userId: string, hoaId: string): Promise<boolean> {
  return await isHOAAdmin(userId, hoaId)
}

export async function canDeleteContent(userId: string, hoaId: string, contentAuthorId: string): Promise<boolean> {
  // Content author can delete their own content
  if (userId === contentAuthorId) return true
  
  // HOA admins can delete any content in their HOA
  return await isHOAAdmin(userId, hoaId)
}

export function requireAuth(user: ExtendedSession['user'] | null): ExtendedSession['user'] {
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireHOAMember(userId: string, hoaId: string): Promise<void> {
  if (!(await isHOAMember(userId, hoaId))) {
    throw new Error('HOA membership required')
  }
}

export async function requireHOAAdmin(userId: string, hoaId: string): Promise<void> {
  if (!(await isHOAAdmin(userId, hoaId))) {
    throw new Error('HOA admin privileges required')
  }
}

export function requirePlatformAdmin(user: ExtendedSession['user']): void {
  if (!isPlatformAdmin(user)) {
    throw new Error('Platform admin privileges required')
  }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionError'
  }
}
