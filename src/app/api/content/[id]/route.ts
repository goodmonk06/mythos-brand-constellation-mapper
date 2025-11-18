import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateContentPieceSchema } from '@/lib/validations'
import { handleError, NotFoundError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const content = await prisma.contentPiece.findUnique({
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

    if (!content) {
      throw new NotFoundError('Content piece', params.id)
    }

    metrics.recordCounter('api.content.get')
    return NextResponse.json({ content })
  } catch (error) {
    logger.error('Error fetching content', error)
    return handleError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateContentPieceSchema.parse(body)

    const existing = await prisma.contentPiece.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      throw new NotFoundError('Content piece', params.id)
    }

    const { symbolIds, pillarIds, publishedAt, ...updateData } = validatedData

    // Update content and handle symbol/pillar relationships
    const content = await prisma.contentPiece.update({
      where: { id: params.id },
      data: {
        ...updateData,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
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

    // Update symbol relationships if provided
    if (symbolIds !== undefined) {
      await prisma.contentPieceSymbol.deleteMany({
        where: { contentPieceId: params.id },
      })
      if (symbolIds.length > 0) {
        await prisma.contentPieceSymbol.createMany({
          data: symbolIds.map((symbolId) => ({
            contentPieceId: params.id,
            symbolId,
          })),
        })
      }
    }

    // Update pillar relationships if provided
    if (pillarIds !== undefined) {
      await prisma.contentPiecePillar.deleteMany({
        where: { contentPieceId: params.id },
      })
      if (pillarIds.length > 0) {
        await prisma.contentPiecePillar.createMany({
          data: pillarIds.map((pillarId) => ({
            contentPieceId: params.id,
            pillarId,
          })),
        })
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        communityId: existing.communityId,
        entityType: 'ContentPiece',
        entityId: content.id,
        action: 'updated',
        changes: { updates: validatedData },
      },
    })

    // Fetch updated content with new relationships
    const updatedContent = await prisma.contentPiece.findUnique({
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

    metrics.recordCounter('api.content.update')
    logger.info('Updated content piece', { contentId: content.id })

    return NextResponse.json({ content: updatedContent })
  } catch (error) {
    logger.error('Error updating content', error)
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.contentPiece.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      throw new NotFoundError('Content piece', params.id)
    }

    await prisma.contentPiece.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        communityId: existing.communityId,
        entityType: 'ContentPiece',
        entityId: params.id,
        action: 'deleted',
      },
    })

    metrics.recordCounter('api.content.delete')
    logger.info('Deleted content piece', { contentId: params.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting content', error)
    return handleError(error)
  }
}
