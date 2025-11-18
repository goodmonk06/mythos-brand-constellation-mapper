import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createSymbolRelationshipSchema } from '@/lib/validations'
import { handleError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fromSymbolId = searchParams.get('fromSymbolId')
    const toSymbolId = searchParams.get('toSymbolId')
    const relationshipType = searchParams.get('relationshipType')

    const where: any = {}
    if (fromSymbolId) where.fromSymbolId = fromSymbolId
    if (toSymbolId) where.toSymbolId = toSymbolId
    if (relationshipType) where.relationshipType = relationshipType

    const relationships = await prisma.symbolRelationship.findMany({
      where,
      include: {
        fromSymbol: true,
        toSymbol: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    metrics.recordCounter('api.symbol_relationships.list')
    logger.info('Listed symbol relationships', { count: relationships.length, filters: where })

    return NextResponse.json({ relationships })
  } catch (error) {
    logger.error('Error fetching symbol relationships', error)
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createSymbolRelationshipSchema.parse(body)

    // Verify symbols exist
    const [fromSymbol, toSymbol] = await Promise.all([
      prisma.mythicSymbol.findUnique({ where: { id: validatedData.fromSymbolId } }),
      prisma.mythicSymbol.findUnique({ where: { id: validatedData.toSymbolId } }),
    ])

    if (!fromSymbol || !toSymbol) {
      return NextResponse.json(
        { error: 'One or both symbols not found' },
        { status: 404 }
      )
    }

    const relationship = await prisma.symbolRelationship.create({
      data: validatedData,
      include: {
        fromSymbol: true,
        toSymbol: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        communityId: fromSymbol.communityId,
        entityType: 'SymbolRelationship',
        entityId: relationship.id,
        action: 'created',
        changes: { relationship: validatedData },
      },
    })

    metrics.recordCounter('api.symbol_relationships.create')
    logger.info('Created symbol relationship', { relationshipId: relationship.id })

    return NextResponse.json({ relationship }, { status: 201 })
  } catch (error) {
    logger.error('Error creating symbol relationship', error)
    return handleError(error)
  }
}
