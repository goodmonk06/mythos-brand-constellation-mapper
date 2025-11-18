import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const communityId = 'demo'

  // Clean existing data for demo community
  await prisma.constellationLink.deleteMany({ where: { symbol: { communityId } } })
  await prisma.mythicSymbol.deleteMany({ where: { communityId } })
  await prisma.brandPillar.deleteMany({ where: { communityId } })

  // Create Mythic Symbols
  const phoenix = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'phoenix',
      name: 'Phoenix',
      category: 'animal',
      descriptionMarkdown: `The phoenix is a mythical bird that cyclically regenerates from its own ashes. It represents rebirth, renewal, and the triumph over adversity. In storytelling, the phoenix symbolizes transformation, resilience, and the eternal cycle of death and rebirth.`,
    },
  })

  const fireElement = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'fire-element',
      name: 'Fire',
      category: 'element',
      descriptionMarkdown: `Fire represents transformation, passion, energy, and purification. It destroys but also creates, clearing the old to make way for the new. Fire is the element of action, inspiration, and creative force.`,
    },
  })

  const sword = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'sword-of-truth',
      name: 'Sword of Truth',
      category: 'object',
      descriptionMarkdown: `The sword represents clarity, discernment, and the cutting through of illusion. It symbolizes the power of truth, justice, and the ability to sever ties with the past. In many myths, the sword is a tool of heroes and leaders.`,
    },
  })

  const prometheus = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'prometheus',
      name: 'Prometheus',
      category: 'myth_figure',
      descriptionMarkdown: `Prometheus is the titan who stole fire from the gods and gave it to humanity, enabling progress and civilization. He represents rebellion against unjust authority, sacrifice for the greater good, and the bringing of knowledge and enlightenment.`,
    },
  })

  const creator = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'creator-archetype',
      name: 'The Creator',
      category: 'archetype',
      descriptionMarkdown: `The Creator archetype embodies imagination, vision, and the drive to bring new things into existence. Creators are innovative, expressive, and often non-conformist. They value originality and self-expression above all.`,
    },
  })

  const mountain = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'sacred-mountain',
      name: 'Sacred Mountain',
      category: 'object',
      descriptionMarkdown: `Mountains are places of transcendence, challenge, and spiritual enlightenment. Climbing the mountain represents the hero's journey, the quest for higher understanding, and the test of character. Mountains connect earth and sky, the mundane and the divine.`,
    },
  })

  // Create Brand Pillars
  const innovation = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'innovation',
      name: 'Innovation & Creativity',
      descriptionMarkdown: `We believe in pushing boundaries and creating new possibilities. Innovation isn't just about technology—it's about reimagining how we solve problems and serve our community.`,
    },
  })

  const transformation = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'transformation',
      name: 'Transformation & Growth',
      descriptionMarkdown: `We empower individuals and communities to transform and evolve. Growth comes through challenge, and we provide the tools and support for meaningful change.`,
    },
  })

  const authenticity = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'authenticity',
      name: 'Authenticity & Truth',
      descriptionMarkdown: `We value transparency, honesty, and staying true to our values. Authenticity builds trust and creates genuine connections with our community.`,
    },
  })

  const community = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'community-first',
      name: 'Community First',
      descriptionMarkdown: `Everything we do starts with community needs. We build together, learn together, and succeed together. Our community is our greatest asset.`,
    },
  })

  // Create Constellation Links
  const links = [
    // Phoenix connections
    {
      symbolId: phoenix.id,
      pillarId: transformation.id,
      linkType: 'core' as const,
      notesMarkdown: 'The phoenix is the ultimate symbol of transformation and rebirth, directly embodying our commitment to personal and collective growth.',
    },
    {
      symbolId: phoenix.id,
      pillarId: innovation.id,
      linkType: 'supporting' as const,
      notesMarkdown: 'Rising from ashes represents innovative thinking—destroying old patterns to create something entirely new.',
    },

    // Fire connections
    {
      symbolId: fireElement.id,
      pillarId: transformation.id,
      linkType: 'core' as const,
      notesMarkdown: 'Fire transforms everything it touches, burning away the old to create space for the new—essential to growth.',
    },
    {
      symbolId: fireElement.id,
      pillarId: innovation.id,
      linkType: 'core' as const,
      notesMarkdown: 'Fire represents creative energy, passion, and the spark of inspiration that drives innovation.',
    },

    // Sword connections
    {
      symbolId: sword.id,
      pillarId: authenticity.id,
      linkType: 'core' as const,
      notesMarkdown: 'The sword cuts through illusion to reveal truth, representing our commitment to authenticity and transparency.',
    },
    {
      symbolId: sword.id,
      pillarId: transformation.id,
      linkType: 'supporting' as const,
      notesMarkdown: 'The sword severs ties with the past, enabling transformation by cutting away what no longer serves.',
    },

    // Prometheus connections
    {
      symbolId: prometheus.id,
      pillarId: innovation.id,
      linkType: 'core' as const,
      notesMarkdown: 'Prometheus brought fire (knowledge/technology) to humanity, embodying the innovative spirit of bringing new capabilities to our community.',
    },
    {
      symbolId: prometheus.id,
      pillarId: community.id,
      linkType: 'core' as const,
      notesMarkdown: 'Prometheus sacrificed for the greater good, representing our community-first values and willingness to take risks for collective benefit.',
    },

    // Creator archetype connections
    {
      symbolId: creator.id,
      pillarId: innovation.id,
      linkType: 'core' as const,
      notesMarkdown: 'The Creator archetype is innovation personified—bringing imagination and vision into reality.',
    },
    {
      symbolId: creator.id,
      pillarId: authenticity.id,
      linkType: 'supporting' as const,
      notesMarkdown: 'Creators value authentic self-expression and staying true to their unique vision.',
    },

    // Mountain connections
    {
      symbolId: mountain.id,
      pillarId: transformation.id,
      linkType: 'supporting' as const,
      notesMarkdown: 'Climbing the mountain represents the challenging journey of transformation and personal growth.',
    },
    {
      symbolId: mountain.id,
      pillarId: community.id,
      linkType: 'supporting' as const,
      notesMarkdown: 'Mountains are often sacred gathering places for communities, representing shared spiritual and cultural values.',
    },
  ]

  for (const link of links) {
    await prisma.constellationLink.create({ data: link })
  }

  console.log('✅ Seed completed!')
  console.log(`
  Created:
  - 6 Mythic Symbols (Phoenix, Fire, Sword, Prometheus, Creator, Mountain)
  - 4 Brand Pillars (Innovation, Transformation, Authenticity, Community)
  - ${links.length} Constellation Links

  Run the app and visit:
  - http://localhost:3000/symbols
  - http://localhost:3000/pillars
  - http://localhost:3000/constellation
  `)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
