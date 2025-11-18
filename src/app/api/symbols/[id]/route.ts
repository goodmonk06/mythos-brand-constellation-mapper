import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateMythicSymbolSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const symbol = await prisma.mythicSymbol.findUnique({
      where: { id: params.id },
      include: {
        constellationLinks: {
          include: {
            pillar: true,
          },
        },
      },
    })

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol not found' }, { status: 404 })
    }

    return NextResponse.json({ symbol })
  } catch (error) {
    console.error('Error fetching symbol:', error)
    return NextResponse.json(
      { error: 'Failed to fetch symbol' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateMythicSymbolSchema.parse(body)

    const symbol = await prisma.mythicSymbol.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json({ symbol })
  } catch (error) {
    console.error('Error updating symbol:', error)
    return NextResponse.json(
      { error: 'Failed to update symbol' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.mythicSymbol.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting symbol:', error)
    return NextResponse.json(
      { error: 'Failed to delete symbol' },
      { status: 500 }
    )
  }
}
