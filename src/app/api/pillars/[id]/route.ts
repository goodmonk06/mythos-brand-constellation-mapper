import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateBrandPillarSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pillar = await prisma.brandPillar.findUnique({
      where: { id: params.id },
      include: {
        constellationLinks: {
          include: {
            symbol: true,
          },
        },
      },
    })

    if (!pillar) {
      return NextResponse.json({ error: 'Pillar not found' }, { status: 404 })
    }

    return NextResponse.json({ pillar })
  } catch (error) {
    console.error('Error fetching pillar:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pillar' },
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
    const validatedData = updateBrandPillarSchema.parse(body)

    const pillar = await prisma.brandPillar.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json({ pillar })
  } catch (error) {
    console.error('Error updating pillar:', error)
    return NextResponse.json(
      { error: 'Failed to update pillar' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.brandPillar.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pillar:', error)
    return NextResponse.json(
      { error: 'Failed to delete pillar' },
      { status: 500 }
    )
  }
}
