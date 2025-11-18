import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createConstellationThemeSchema } from '@/lib/validations'
import { handleError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const communityId = searchParams.get('communityId')

    const where: any = {}
    if (communityId) where.communityId = communityId

    const themes = await prisma.constellationTheme.findMany({
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

    metrics.recordCounter('api.themes.list')
    logger.info('Listed themes', { count: themes.length })

    return NextResponse.json({ themes })
  } catch (error) {
    logger.error('Error fetching themes', error)
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createConstellationThemeSchema.parse(body)

    const { symbolIds, pillarIds, ...themeData } = validatedData

    const theme = await prisma.constellationTheme.create({
      data: {
        ...themeData,
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
        communityId: theme.communityId,
        entityType: 'ConstellationTheme',
        entityId: theme.id,
        action: 'created',
        changes: { theme: themeData },
      },
    })

    metrics.recordCounter('api.themes.create')
    logger.info('Created theme', { themeId: theme.id })

    return NextResponse.json({ theme }, { status: 201 })
  } catch (error) {
    logger.error('Error creating theme', error)
    return handleError(error)
  }
}
