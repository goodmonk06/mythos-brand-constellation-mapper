import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateSymbolRelationshipSchema } from '@/lib/validations'
import { handleError, NotFoundError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const relationship = await prisma.symbolRelationship.findUnique({
      where: { id: params.id },
      include: {
        fromSymbol: true,
        toSymbol: true,
      },
    })

    if (!relationship) {
      throw new NotFoundError('Symbol relationship', params.id)
    }

    metrics.recordCounter('api.symbol_relationships.get')
    return NextResponse.json({ relationship })
  } catch (error) {
    logger.error('Error fetching symbol relationship', error)
    return handleError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateSymbolRelationshipSchema.parse(body)

    const existing = await prisma.symbolRelationship.findUnique({
      where: { id: params.id },
      include: { fromSymbol: true },
    })

    if (!existing) {
      throw new NotFoundError('Symbol relationship', params.id)
    }

    const relationship = await prisma.symbolRelationship.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        fromSymbol: true,
        toSymbol: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        communityId: existing.fromSymbol.communityId,
        entityType: 'SymbolRelationship',
        entityId: relationship.id,
        action: 'updated',
        changes: { updates: validatedData },
      },
    })

    metrics.recordCounter('api.symbol_relationships.update')
    logger.info('Updated symbol relationship', { relationshipId: relationship.id })

    return NextResponse.json({ relationship })
  } catch (error) {
    logger.error('Error updating symbol relationship', error)
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.symbolRelationship.findUnique({
      where: { id: params.id },
      include: { fromSymbol: true },
    })

    if (!existing) {
      throw new NotFoundError('Symbol relationship', params.id)
    }

    await prisma.symbolRelationship.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        communityId: existing.fromSymbol.communityId,
        entityType: 'SymbolRelationship',
        entityId: params.id,
        action: 'deleted',
      },
    })

    metrics.recordCounter('api.symbol_relationships.delete')
    logger.info('Deleted symbol relationship', { relationshipId: params.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting symbol relationship', error)
    return handleError(error)
  }
}
