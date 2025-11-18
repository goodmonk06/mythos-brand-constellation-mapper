import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Get complete constellation data for visualization
 * Returns symbols, pillars, and links in a format optimized for graph/matrix views
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const communityId = searchParams.get('communityId')

    if (!communityId) {
      return NextResponse.json(
        { error: 'communityId is required' },
        { status: 400 }
      )
    }

    const [symbols, pillars, links] = await Promise.all([
      prisma.mythicSymbol.findMany({
        where: { communityId },
        include: {
          _count: {
            select: { constellationLinks: true },
          },
        },
      }),
      prisma.brandPillar.findMany({
        where: { communityId },
        include: {
          _count: {
            select: { constellationLinks: true },
          },
        },
      }),
      prisma.constellationLink.findMany({
        where: {
          symbol: { communityId },
        },
        include: {
          symbol: true,
          pillar: true,
        },
      }),
    ])

    // Build graph data structure
    const nodes = [
      ...symbols.map(s => ({
        id: s.id,
        type: 'symbol' as const,
        key: s.key,
        name: s.name,
        category: s.category,
        linkCount: s._count.constellationLinks,
      })),
      ...pillars.map(p => ({
        id: p.id,
        type: 'pillar' as const,
        key: p.key,
        name: p.name,
        linkCount: p._count.constellationLinks,
      })),
    ]

    const edges = links.map(l => ({
      id: l.id,
      source: l.symbolId,
      target: l.pillarId,
      linkType: l.linkType,
      notes: l.notesMarkdown,
    }))

    // Build matrix data structure
    const matrix = {
      symbols: symbols.map(s => ({ id: s.id, name: s.name, category: s.category })),
      pillars: pillars.map(p => ({ id: p.id, name: p.name })),
      cells: links.map(l => ({
        symbolId: l.symbolId,
        pillarId: l.pillarId,
        linkType: l.linkType,
        linkId: l.id,
      })),
    }

    return NextResponse.json({
      constellation: {
        communityId,
        graph: { nodes, edges },
        matrix,
        stats: {
          symbolCount: symbols.length,
          pillarCount: pillars.length,
          linkCount: links.length,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching constellation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch constellation data' },
      { status: 500 }
    )
  }
}
