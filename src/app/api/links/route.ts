import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createConstellationLinkSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const symbolId = searchParams.get('symbolId')
    const pillarId = searchParams.get('pillarId')
    const linkType = searchParams.get('linkType')

    const where: any = {}
    if (symbolId) where.symbolId = symbolId
    if (pillarId) where.pillarId = pillarId
    if (linkType) where.linkType = linkType

    const links = await prisma.constellationLink.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        symbol: true,
        pillar: true,
      },
    })

    return NextResponse.json({ links })
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createConstellationLinkSchema.parse(body)

    const link = await prisma.constellationLink.create({
      data: validatedData,
      include: {
        symbol: true,
        pillar: true,
      },
    })

    return NextResponse.json({ link }, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    )
  }
}
