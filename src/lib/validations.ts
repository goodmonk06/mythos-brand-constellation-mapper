import { z } from 'zod'

// Enums
export const SymbolCategory = z.enum([
  'animal',
  'element',
  'object',
  'myth_figure',
  'archetype',
  'other',
])

export const LinkType = z.enum(['core', 'supporting', 'shadow'])

// MythicSymbol schemas
export const createMythicSymbolSchema = z.object({
  communityId: z.string().min(1),
  key: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Key must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1),
  descriptionMarkdown: z.string(),
  category: SymbolCategory,
})

export const updateMythicSymbolSchema = createMythicSymbolSchema.partial().omit({ communityId: true })

// BrandPillar schemas
export const createBrandPillarSchema = z.object({
  communityId: z.string().min(1),
  key: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Key must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1),
  descriptionMarkdown: z.string(),
})

export const updateBrandPillarSchema = createBrandPillarSchema.partial().omit({ communityId: true })

// ConstellationLink schemas
export const createConstellationLinkSchema = z.object({
  symbolId: z.string().cuid(),
  pillarId: z.string().cuid(),
  linkType: LinkType,
  notesMarkdown: z.string(),
})

export const updateConstellationLinkSchema = createConstellationLinkSchema.partial()

// Query schemas
export const communityQuerySchema = z.object({
  communityId: z.string().min(1),
})

// Type exports
export type CreateMythicSymbol = z.infer<typeof createMythicSymbolSchema>
export type UpdateMythicSymbol = z.infer<typeof updateMythicSymbolSchema>
export type CreateBrandPillar = z.infer<typeof createBrandPillarSchema>
export type UpdateBrandPillar = z.infer<typeof updateBrandPillarSchema>
export type CreateConstellationLink = z.infer<typeof createConstellationLinkSchema>
export type UpdateConstellationLink = z.infer<typeof updateConstellationLinkSchema>
