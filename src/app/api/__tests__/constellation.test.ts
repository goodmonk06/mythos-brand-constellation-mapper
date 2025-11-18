import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Constellation API Integration', () => {
  const testCommunityId = 'test-constellation'
  let symbolId: string
  let pillarId: string
  let linkId: string

  beforeAll(async () => {
    // Clean up
    await prisma.constellationLink.deleteMany({
      where: { symbol: { communityId: testCommunityId } },
    })
    await prisma.mythicSymbol.deleteMany({
      where: { communityId: testCommunityId },
    })
    await prisma.brandPillar.deleteMany({
      where: { communityId: testCommunityId },
    })

    // Create test data
    const symbol = await prisma.mythicSymbol.create({
      data: {
        communityId: testCommunityId,
        key: 'test-fire',
        name: 'Fire',
        category: 'element',
        descriptionMarkdown: 'Fire element',
      },
    })
    symbolId = symbol.id

    const pillar = await prisma.brandPillar.create({
      data: {
        communityId: testCommunityId,
        key: 'test-innovation',
        name: 'Innovation',
        descriptionMarkdown: 'Innovation pillar',
      },
    })
    pillarId = pillar.id
  })

  afterAll(async () => {
    await prisma.constellationLink.deleteMany({
      where: { symbol: { communityId: testCommunityId } },
    })
    await prisma.mythicSymbol.deleteMany({
      where: { communityId: testCommunityId },
    })
    await prisma.brandPillar.deleteMany({
      where: { communityId: testCommunityId },
    })
    await prisma.$disconnect()
  })

  it('should create a constellation link', async () => {
    const link = await prisma.constellationLink.create({
      data: {
        symbolId,
        pillarId,
        linkType: 'core',
        notesMarkdown: 'Fire represents the spark of innovation',
      },
    })

    linkId = link.id
    expect(link.id).toBeDefined()
    expect(link.linkType).toBe('core')
  })

  it('should retrieve full constellation data', async () => {
    const [symbols, pillars, links] = await Promise.all([
      prisma.mythicSymbol.findMany({
        where: { communityId: testCommunityId },
      }),
      prisma.brandPillar.findMany({
        where: { communityId: testCommunityId },
      }),
      prisma.constellationLink.findMany({
        where: { symbol: { communityId: testCommunityId } },
        include: { symbol: true, pillar: true },
      }),
    ])

    expect(symbols.length).toBeGreaterThan(0)
    expect(pillars.length).toBeGreaterThan(0)
    expect(links.length).toBeGreaterThan(0)
    expect(links[0].symbol).toBeDefined()
    expect(links[0].pillar).toBeDefined()
  })

  it('should support all link types', async () => {
    const symbol2 = await prisma.mythicSymbol.create({
      data: {
        communityId: testCommunityId,
        key: 'test-water',
        name: 'Water',
        category: 'element',
        descriptionMarkdown: 'Water element',
      },
    })

    const supportingLink = await prisma.constellationLink.create({
      data: {
        symbolId: symbol2.id,
        pillarId,
        linkType: 'supporting',
        notesMarkdown: 'Water supports innovation through flow',
      },
    })

    expect(supportingLink.linkType).toBe('supporting')

    const shadowLink = await prisma.constellationLink.create({
      data: {
        symbolId: symbol2.id,
        pillarId,
        linkType: 'shadow',
        notesMarkdown: 'Can drown innovation if unchecked',
      },
    })

    expect(shadowLink.linkType).toBe('shadow')
  })

  it('should prevent duplicate symbol-pillar links', async () => {
    await expect(
      prisma.constellationLink.create({
        data: {
          symbolId,
          pillarId,
          linkType: 'supporting',
          notesMarkdown: 'Duplicate link',
        },
      })
    ).rejects.toThrow()
  })

  it('should cascade delete links when symbol is deleted', async () => {
    const tempSymbol = await prisma.mythicSymbol.create({
      data: {
        communityId: testCommunityId,
        key: 'temp-symbol',
        name: 'Temp',
        category: 'other',
        descriptionMarkdown: 'Temporary',
      },
    })

    const tempLink = await prisma.constellationLink.create({
      data: {
        symbolId: tempSymbol.id,
        pillarId,
        linkType: 'core',
        notesMarkdown: 'Temp link',
      },
    })

    await prisma.mythicSymbol.delete({
      where: { id: tempSymbol.id },
    })

    const deletedLink = await prisma.constellationLink.findUnique({
      where: { id: tempLink.id },
    })

    expect(deletedLink).toBeNull()
  })
})
