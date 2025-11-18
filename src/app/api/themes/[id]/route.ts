import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateConstellationThemeSchema } from '@/lib/validations'
import { handleError, NotFoundError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const theme = await prisma.constellationTheme.findUnique({
      where: { id: params.id },
      include: {
        symbols: {
          include: { symbol: true },
        },
        pillars: {
          include: { pillar: true },
        },
      },
    })

    if (!theme) {
      throw new NotFoundError('Theme', params.id)
    }

    metrics.recordCounter('api.themes.get')
    return NextResponse.json({ theme })
  } catch (error) {
    logger.error('Error fetching theme', error)
    return handleError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateConstellationThemeSchema.parse(body)

    const existing = await prisma.constellationTheme.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      throw new NotFoundError('Theme', params.id)
    }

    const { symbolIds, pillarIds, ...updateData } = validatedData

    const theme = await prisma.constellationTheme.update({
      where: { id: params.id },
      data: updateData,
    })

    // Update symbol relationships if provided
    if (symbolIds !== undefined) {
      await prisma.themeSymbol.deleteMany({
        where: { themeId: params.id },
      })
      if (symbolIds.length > 0) {
        await prisma.themeSymbol.createMany({
          data: symbolIds.map((symbolId) => ({
            themeId: params.id,
            symbolId,
          })),
        })
      }
    }

    // Update pillar relationships if provided
    if (pillarIds !== undefined) {
      await prisma.themePillar.deleteMany({
        where: { themeId: params.id },
      })
      if (pillarIds.length > 0) {
        await prisma.themePillar.createMany({
          data: pillarIds.map((pillarId) => ({
            themeId: params.id,
            pillarId,
          })),
        })
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        communityId: existing.communityId,
        entityType: 'ConstellationTheme',
        entityId: theme.id,
        action: 'updated',
        changes: { updates: validatedData },
      },
    })

    // Fetch updated theme with relationships
    const updatedTheme = await prisma.constellationTheme.findUnique({
      where: { id: params.id },
      include: {
        symbols: {
          include: { symbol: true },
        },
        pillars: {
          include: { pillar: true },
        },
      },
    })

    metrics.recordCounter('api.themes.update')
    logger.info('Updated theme', { themeId: theme.id })

    return NextResponse.json({ theme: updatedTheme })
  } catch (error) {
    logger.error('Error updating theme', error)
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.constellationTheme.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      throw new NotFoundError('Theme', params.id)
    }

    await prisma.constellationTheme.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        communityId: existing.communityId,
        entityType: 'ConstellationTheme',
        entityId: params.id,
        action: 'deleted',
      },
    })

    metrics.recordCounter('api.themes.delete')
    logger.info('Deleted theme', { themeId: params.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting theme', error)
    return handleError(error)
  }
}
