import { z } from "zod"

export const createReviewSchema = z.object({
  hoaId: z.string().cuid(),
  stars: z.number().min(1).max(5),
  text: z.string().min(10).max(2000).optional(),
  isAnonymous: z.boolean().default(false),
})

export const createPostSchema = z.object({
  hoaId: z.string().cuid(),
  title: z.string().min(5).max(200),
  body: z.string().min(10).max(10000),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE'),
})

export const createCommentSchema = z.object({
  postId: z.string().cuid(),
  body: z.string().min(1).max(2000),
})

export const membershipRequestSchema = z.object({
  hoaId: z.string().cuid(),
  note: z.string().max(500).optional(),
})

export const membershipActionSchema = z.object({
  membershipId: z.string().cuid(),
  action: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().max(500).optional(),
})

export const adminResponseSchema = z.object({
  reviewId: z.string().cuid(),
  text: z.string().min(10).max(1000),
})

export const searchSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  ratingMin: z.number().min(1).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
})

export const flagContentSchema = z.object({
  targetType: z.enum(['REVIEW', 'POST', 'COMMENT', 'USER']),
  targetId: z.string().cuid(),
  reason: z.string().min(10).max(500),
})

export const updateHOASchema = z.object({
  name: z.string().min(2).max(200).optional(),
  descriptionPublic: z.string().max(2000).optional(),
  descriptionPrivate: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  amenities: z.array(z.string()).optional(),
  unitCount: z.number().min(1).optional(),
})

export const createEventSchema = z.object({
  hoaId: z.string().cuid(),
  title: z.string().min(5).max(200),
  startsAt: z.date(),
  endsAt: z.date().optional(),
  location: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE'),
})

export const createDocumentSchema = z.object({
  hoaId: z.string().cuid(),
  title: z.string().min(2).max(200),
  url: z.string().url(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PRIVATE'),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type MembershipRequestInput = z.infer<typeof membershipRequestSchema>
export type MembershipActionInput = z.infer<typeof membershipActionSchema>
export type AdminResponseInput = z.infer<typeof adminResponseSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type FlagContentInput = z.infer<typeof flagContentSchema>
export type UpdateHOAInput = z.infer<typeof updateHOASchema>
export type CreateEventInput = z.infer<typeof createEventSchema>
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>
