import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Symbols API Integration', () => {
  const testCommunityId = 'test-integration'

  beforeAll(async () => {
    // Clean up test data
    await prisma.constellationLink.deleteMany({
      where: { symbol: { communityId: testCommunityId } },
    })
    await prisma.mythicSymbol.deleteMany({
      where: { communityId: testCommunityId },
    })
  })

  afterAll(async () => {
    // Clean up
    await prisma.constellationLink.deleteMany({
      where: { symbol: { communityId: testCommunityId } },
    })
    await prisma.mythicSymbol.deleteMany({
      where: { communityId: testCommunityId },
    })
    await prisma.$disconnect()
  })

  it('should create a mythic symbol', async () => {
    const symbol = await prisma.mythicSymbol.create({
      data: {
        communityId: testCommunityId,
        key: 'test-phoenix',
        name: 'Test Phoenix',
        category: 'animal',
        descriptionMarkdown: 'A test phoenix for integration testing',
      },
    })

    expect(symbol.id).toBeDefined()
    expect(symbol.name).toBe('Test Phoenix')
    expect(symbol.category).toBe('animal')
  })

  it('should list symbols by community', async () => {
    const symbols = await prisma.mythicSymbol.findMany({
      where: { communityId: testCommunityId },
    })

    expect(symbols.length).toBeGreaterThan(0)
    expect(symbols[0].communityId).toBe(testCommunityId)
  })

  it('should retrieve symbol with details', async () => {
    const created = await prisma.mythicSymbol.create({
      data: {
        communityId: testCommunityId,
        key: 'test-dragon',
        name: 'Test Dragon',
        category: 'myth_figure',
        descriptionMarkdown: 'A mighty dragon',
      },
    })

    const symbol = await prisma.mythicSymbol.findUnique({
      where: { id: created.id },
      include: { constellationLinks: true },
    })

    expect(symbol).toBeDefined()
    expect(symbol?.name).toBe('Test Dragon')
    expect(symbol?.constellationLinks).toBeDefined()
  })

  it('should update a symbol', async () => {
    const created = await prisma.mythicSymbol.create({
      data: {
        communityId: testCommunityId,
        key: 'test-wolf',
        name: 'Test Wolf',
        category: 'animal',
        descriptionMarkdown: 'Original description',
      },
    })

    const updated = await prisma.mythicSymbol.update({
      where: { id: created.id },
      data: { descriptionMarkdown: 'Updated description' },
    })

    expect(updated.descriptionMarkdown).toBe('Updated description')
  })

  it('should enforce unique key per community', async () => {
    await prisma.mythicSymbol.create({
      data: {
        communityId: testCommunityId,
        key: 'unique-key',
        name: 'First',
        category: 'other',
        descriptionMarkdown: 'Test',
      },
    })

    await expect(
      prisma.mythicSymbol.create({
        data: {
          communityId: testCommunityId,
          key: 'unique-key',
          name: 'Second',
          category: 'other',
          descriptionMarkdown: 'Test',
        },
      })
    ).rejects.toThrow()
  })

  it('should delete a symbol and cascade links', async () => {
    const symbol = await prisma.mythicSymbol.create({
      data: {
        communityId: testCommunityId,
        key: 'to-delete',
        name: 'To Delete',
        category: 'other',
        descriptionMarkdown: 'Test',
      },
    })

    await prisma.mythicSymbol.delete({
      where: { id: symbol.id },
    })

    const deleted = await prisma.mythicSymbol.findUnique({
      where: { id: symbol.id },
    })

    expect(deleted).toBeNull()
  })
})
