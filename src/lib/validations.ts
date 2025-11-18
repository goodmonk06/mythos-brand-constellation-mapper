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

export const PillarPriority = z.enum(['high', 'medium', 'low'])

export const SymbolRelationType = z.enum([
  'transforms_into',
  'opposes',
  'complements',
  'contains',
  'emerges_from',
])

export const ContentType = z.enum([
  'blog_post',
  'video',
  'image',
  'design',
  'campaign',
  'event',
  'social_post',
  'other',
])

export const ContentStatus = z.enum(['draft', 'published', 'archived'])

// MythicSymbol schemas
export const createMythicSymbolSchema = z.object({
  communityId: z.string().min(1),
  key: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Key must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1),
  descriptionMarkdown: z.string(),
  category: SymbolCategory,
  tags: z.array(z.string()).optional(),
  culturalOrigin: z.string().optional(),
  symbolicQualities: z.record(z.boolean()).optional(),
  relatedConcepts: z.array(z.string()).optional(),
})

export const updateMythicSymbolSchema = createMythicSymbolSchema.partial().omit({ communityId: true })

// BrandPillar schemas
export const createBrandPillarSchema = z.object({
  communityId: z.string().min(1),
  key: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Key must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1),
  descriptionMarkdown: z.string(),
  priority: PillarPriority.optional(),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be valid hex color').optional(),
  contentGuidelines: z.string().optional(),
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

// SymbolRelationship schemas
export const createSymbolRelationshipSchema = z.object({
  fromSymbolId: z.string().cuid(),
  toSymbolId: z.string().cuid(),
  relationshipType: SymbolRelationType,
  notesMarkdown: z.string(),
})

export const updateSymbolRelationshipSchema = createSymbolRelationshipSchema.partial()

// ContentPiece schemas
export const createContentPieceSchema = z.object({
  communityId: z.string().min(1),
  title: z.string().min(1),
  descriptionMarkdown: z.string(),
  contentType: ContentType,
  url: z.string().url().optional(),
  status: ContentStatus.optional(),
  publishedAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
  symbolIds: z.array(z.string().cuid()).optional(),
  pillarIds: z.array(z.string().cuid()).optional(),
})

export const updateContentPieceSchema = createContentPieceSchema.partial().omit({ communityId: true })

// ConstellationTheme schemas
export const createConstellationThemeSchema = z.object({
  communityId: z.string().min(1),
  key: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Key must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1),
  descriptionMarkdown: z.string(),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be valid hex color').optional(),
  symbolIds: z.array(z.string().cuid()).optional(),
  pillarIds: z.array(z.string().cuid()).optional(),
})

export const updateConstellationThemeSchema = createConstellationThemeSchema.partial().omit({ communityId: true })

// Type exports
export type CreateMythicSymbol = z.infer<typeof createMythicSymbolSchema>
export type UpdateMythicSymbol = z.infer<typeof updateMythicSymbolSchema>
export type CreateBrandPillar = z.infer<typeof createBrandPillarSchema>
export type UpdateBrandPillar = z.infer<typeof updateBrandPillarSchema>
export type CreateConstellationLink = z.infer<typeof createConstellationLinkSchema>
export type UpdateConstellationLink = z.infer<typeof updateConstellationLinkSchema>
export type CreateSymbolRelationship = z.infer<typeof createSymbolRelationshipSchema>
export type UpdateSymbolRelationship = z.infer<typeof updateSymbolRelationshipSchema>
export type CreateContentPiece = z.infer<typeof createContentPieceSchema>
export type UpdateContentPiece = z.infer<typeof updateContentPieceSchema>
export type CreateConstellationTheme = z.infer<typeof createConstellationThemeSchema>
export type UpdateConstellationTheme = z.infer<typeof updateConstellationThemeSchema>
