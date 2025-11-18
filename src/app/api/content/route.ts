import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createContentPieceSchema } from '@/lib/validations'
import { handleError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const communityId = searchParams.get('communityId')
    const contentType = searchParams.get('contentType')
    const status = searchParams.get('status')

    const where: any = {}
    if (communityId) where.communityId = communityId
    if (contentType) where.contentType = contentType
    if (status) where.status = status

    const content = await prisma.contentPiece.findMany({
      where,
      include: {
        symbols: {
          include: { symbol: true },
        },
        pillars: {
          include: { pillar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    metrics.recordCounter('api.content.list')
    logger.info('Listed content pieces', { count: content.length, filters: where })

    return NextResponse.json({ content })
  } catch (error) {
    logger.error('Error fetching content', error)
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createContentPieceSchema.parse(body)

    const { symbolIds, pillarIds, publishedAt, ...contentData } = validatedData

    const content = await prisma.contentPiece.create({
      data: {
        ...contentData,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        symbols: symbolIds
          ? {
              create: symbolIds.map((symbolId) => ({ symbolId })),
            }
          : undefined,
        pillars: pillarIds
          ? {
              create: pillarIds.map((pillarId) => ({ pillarId })),
            }
          : undefined,
      },
      include: {
        symbols: {
          include: { symbol: true },
        },
        pillars: {
          include: { pillar: true },
        },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        communityId: content.communityId,
        entityType: 'ContentPiece',
        entityId: content.id,
        action: 'created',
        changes: { content: contentData },
      },
    })

    metrics.recordCounter('api.content.create')
    logger.info('Created content piece', { contentId: content.id })

    return NextResponse.json({ content }, { status: 201 })
  } catch (error) {
    logger.error('Error creating content', error)
    return handleError(error)
  }
}
