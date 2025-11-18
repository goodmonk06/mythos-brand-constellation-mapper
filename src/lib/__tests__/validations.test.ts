import { describe, it, expect } from 'vitest'
import {
  createMythicSymbolSchema,
  createBrandPillarSchema,
  createConstellationLinkSchema,
  SymbolCategory,
  LinkType,
} from '../validations'

describe('Validation Schemas', () => {
  describe('createMythicSymbolSchema', () => {
    it('should validate correct mythic symbol data', () => {
      const validData = {
        communityId: 'test-community',
        key: 'phoenix-bird',
        name: 'Phoenix',
        descriptionMarkdown: 'A mythical bird that rises from ashes',
        category: 'animal' as const,
      }

      const result = createMythicSymbolSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid key format', () => {
      const invalidData = {
        communityId: 'test-community',
        key: 'Phoenix Bird!', // Invalid: uppercase and special chars
        name: 'Phoenix',
        descriptionMarkdown: 'A mythical bird',
        category: 'animal' as const,
      }

      const result = createMythicSymbolSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept all valid categories', () => {
      const categories = ['animal', 'element', 'object', 'myth_figure', 'archetype', 'other']

      categories.forEach((category) => {
        const data = {
          communityId: 'test',
          key: 'test-symbol',
          name: 'Test',
          descriptionMarkdown: 'Test description',
          category,
        }

        const result = createMythicSymbolSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('createBrandPillarSchema', () => {
    it('should validate correct brand pillar data', () => {
      const validData = {
        communityId: 'test-community',
        key: 'innovation',
        name: 'Innovation & Creativity',
        descriptionMarkdown: 'We value innovation',
      }

      const result = createBrandPillarSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should require all fields', () => {
      const invalidData = {
        key: 'innovation',
        name: 'Innovation',
      }

      const result = createBrandPillarSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('createConstellationLinkSchema', () => {
    it('should validate correct link data', () => {
      const validData = {
        symbolId: 'clh1234567890',
        pillarId: 'clh0987654321',
        linkType: 'core' as const,
        notesMarkdown: 'Strong connection between symbol and pillar',
      }

      const result = createConstellationLinkSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept all valid link types', () => {
      const linkTypes = ['core', 'supporting', 'shadow']

      linkTypes.forEach((linkType) => {
        const data = {
          symbolId: 'clh1234567890',
          pillarId: 'clh0987654321',
          linkType,
          notesMarkdown: 'Test',
        }

        const result = createConstellationLinkSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })
})
