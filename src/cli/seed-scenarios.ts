import { PrismaClient } from '@prisma/client'

/**
 * Seed Scenario: Demo (Original)
 * A general-purpose example constellation
 */
export async function seedDemo(prisma: PrismaClient) {
  const communityId = 'demo'
  console.log(`  → Seeding: ${communityId}`)

  // Clean existing
  await cleanCommunity(prisma, communityId)

  // Symbols
  const phoenix = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'phoenix',
      name: 'Phoenix',
      category: 'animal',
      descriptionMarkdown: `The phoenix is a mythical bird that cyclically regenerates from its own ashes. It represents rebirth, renewal, and the triumph over adversity.`,
      tags: ['transformation', 'rebirth', 'resilience'],
      culturalOrigin: 'Greek',
      symbolicQualities: { transformation: true, resilience: true, renewal: true },
      relatedConcepts: ['death and rebirth', 'eternal return', 'alchemy'],
    },
  })

  const fire = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'fire-element',
      name: 'Fire',
      category: 'element',
      descriptionMarkdown: `Fire represents transformation, passion, energy, and purification. It destroys but also creates.`,
      tags: ['transformation', 'energy', 'passion'],
      culturalOrigin: 'Universal',
      symbolicQualities: { transformation: true, energy: true, passion: true },
    },
  })

  const sword = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'sword-of-truth',
      name: 'Sword of Truth',
      category: 'object',
      descriptionMarkdown: `The sword represents clarity, discernment, and cutting through illusion. Symbol of truth and justice.`,
      tags: ['truth', 'clarity', 'justice'],
      symbolicQualities: { clarity: true, truth: true, decisiveness: true },
    },
  })

  const prometheus = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'prometheus',
      name: 'Prometheus',
      category: 'myth_figure',
      descriptionMarkdown: `The titan who stole fire from the gods and gave it to humanity. Represents rebellion and enlightenment.`,
      tags: ['rebellion', 'knowledge', 'sacrifice'],
      culturalOrigin: 'Greek',
      symbolicQualities: { rebellion: true, enlightenment: true, sacrifice: true },
    },
  })

  const creator = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'creator-archetype',
      name: 'The Creator',
      category: 'archetype',
      descriptionMarkdown: `The Creator archetype embodies imagination, vision, and bringing new things into existence.`,
      tags: ['creativity', 'innovation', 'expression'],
      symbolicQualities: { creativity: true, originality: true, vision: true },
    },
  })

  const mountain = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'sacred-mountain',
      name: 'Sacred Mountain',
      category: 'object',
      descriptionMarkdown: `Mountains represent transcendence, challenge, and spiritual enlightenment. The hero's journey.`,
      tags: ['transcendence', 'challenge', 'journey'],
      symbolicQualities: { transcendence: true, endurance: true },
    },
  })

  // Pillars
  const innovation = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'innovation',
      name: 'Innovation & Creativity',
      descriptionMarkdown: `We believe in pushing boundaries and creating new possibilities.`,
      priority: 'high',
      colorHex: '#FF6B35',
      contentGuidelines: `Focus on: breakthrough thinking, novel solutions, creative problem-solving.`,
    },
  })

  const transformation = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'transformation',
      name: 'Transformation & Growth',
      descriptionMarkdown: `We empower transformation and meaningful change.`,
      priority: 'high',
      colorHex: '#4ECDC4',
    },
  })

  const authenticity = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'authenticity',
      name: 'Authenticity & Truth',
      descriptionMarkdown: `We value transparency, honesty, and staying true to values.`,
      priority: 'medium',
      colorHex: '#95B8D1',
    },
  })

  const community = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'community-first',
      name: 'Community First',
      descriptionMarkdown: `Everything starts with community needs.`,
      priority: 'high',
      colorHex: '#F7B801',
    },
  })

  // Constellation Links
  await prisma.constellationLink.createMany({
    data: [
      {
        symbolId: phoenix.id,
        pillarId: transformation.id,
        linkType: 'core',
        notesMarkdown: 'Phoenix is the ultimate symbol of transformation and rebirth.',
      },
      {
        symbolId: phoenix.id,
        pillarId: innovation.id,
        linkType: 'supporting',
        notesMarkdown: 'Rising from ashes represents innovative thinking.',
      },
      {
        symbolId: fire.id,
        pillarId: transformation.id,
        linkType: 'core',
        notesMarkdown: 'Fire transforms everything it touches.',
      },
      {
        symbolId: fire.id,
        pillarId: innovation.id,
        linkType: 'core',
        notesMarkdown: 'Fire represents creative energy and inspiration.',
      },
      {
        symbolId: sword.id,
        pillarId: authenticity.id,
        linkType: 'core',
        notesMarkdown: 'The sword cuts through illusion to reveal truth.',
      },
      {
        symbolId: prometheus.id,
        pillarId: innovation.id,
        linkType: 'core',
        notesMarkdown: 'Prometheus brought fire/knowledge to humanity.',
      },
      {
        symbolId: prometheus.id,
        pillarId: community.id,
        linkType: 'core',
        notesMarkdown: 'Prometheus sacrificed for collective benefit.',
      },
      {
        symbolId: creator.id,
        pillarId: innovation.id,
        linkType: 'core',
        notesMarkdown: 'Creator archetype embodies innovation.',
      },
      {
        symbolId: mountain.id,
        pillarId: transformation.id,
        linkType: 'supporting',
        notesMarkdown: 'Climbing the mountain represents transformative journey.',
      },
    ],
  })

  // Symbol Relationships
  await prisma.symbolRelationship.createMany({
    data: [
      {
        fromSymbolId: phoenix.id,
        toSymbolId: fire.id,
        relationshipType: 'transforms_into',
        notesMarkdown: 'Phoenix transforms into fire during rebirth cycle.',
      },
      {
        fromSymbolId: prometheus.id,
        toSymbolId: fire.id,
        relationshipType: 'contains',
        notesMarkdown: 'Prometheus brought fire as gift to humanity.',
      },
    ],
  })

  // Theme
  const fireTheme = await prisma.constellationTheme.create({
    data: {
      communityId,
      key: 'fire-transformation',
      name: 'Fire & Transformation',
      descriptionMarkdown: `The transformative power of fire in all its forms - from creative spark to complete renewal.`,
      colorHex: '#FF6B35',
    },
  })

  await prisma.themeSymbol.createMany({
    data: [
      { themeId: fireTheme.id, symbolId: phoenix.id },
      { themeId: fireTheme.id, symbolId: fire.id },
      { themeId: fireTheme.id, symbolId: prometheus.id },
    ],
  })

  await prisma.themePillar.createMany({
    data: [
      { themeId: fireTheme.id, pillarId: transformation.id },
      { themeId: fireTheme.id, pillarId: innovation.id },
    ],
  })

  // Content
  await prisma.contentPiece.create({
    data: {
      communityId,
      title: 'From Ashes to Innovation: Our Transformation Story',
      descriptionMarkdown: `How we rebuilt our platform from the ground up, embracing the Phoenix metaphor.`,
      contentType: 'blog_post',
      status: 'published',
      publishedAt: new Date('2024-01-15'),
      url: 'https://example.com/blog/phoenix-transformation',
      symbols: {
        create: [{ symbolId: phoenix.id }, { symbolId: fire.id }],
      },
      pillars: {
        create: [{ pillarId: transformation.id }, { pillarId: innovation.id }],
      },
    },
  })

  console.log(`  ✓ Demo constellation seeded`)
}

/**
 * Seed Scenario: Tech Startup
 * A constellation for a disruptive technology company
 */
export async function seedTechStartup(prisma: PrismaClient) {
  const communityId = 'tech-startup'
  console.log(`  → Seeding: ${communityId}`)

  await cleanCommunity(prisma, communityId)

  // Symbols
  const lightning = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'lightning',
      name: 'Lightning',
      category: 'element',
      descriptionMarkdown: `Sudden insight, breakthrough, electric speed. Zeus's weapon of disruption.`,
      tags: ['speed', 'disruption', 'breakthrough'],
      culturalOrigin: 'Greek',
      symbolicQualities: { speed: true, power: true, disruption: true },
    },
  })

  const trickster = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'trickster',
      name: 'The Trickster',
      category: 'archetype',
      descriptionMarkdown: `Breaks rules, challenges conventions, brings chaos that enables new order.`,
      tags: ['disruption', 'innovation', 'unconventional'],
      symbolicQualities: { disruption: true, creativity: true },
    },
  })

  const mercury = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'mercury',
      name: 'Mercury/Hermes',
      category: 'myth_figure',
      descriptionMarkdown: `Messenger god. Speed, communication, commerce, connection between realms.`,
      tags: ['speed', 'communication', 'connection'],
      culturalOrigin: 'Roman/Greek',
      symbolicQualities: { speed: true, communication: true, commerce: true },
    },
  })

  const forge = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'forge',
      name: 'The Forge',
      category: 'object',
      descriptionMarkdown: `Where raw materials become tools. The maker's space. Hephaestus's workshop.`,
      tags: ['creation', 'transformation', 'craft'],
      symbolicQualities: { creation: true, craftsmanship: true },
    },
  })

  const rocket = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'rocket',
      name: 'Rocket Ship',
      category: 'object',
      descriptionMarkdown: `Escape velocity. Reaching beyond limits. The moon shot.`,
      tags: ['ambition', 'scale', 'breakthrough'],
      symbolicQualities: { ambition: true, scale: true },
    },
  })

  // Pillars
  const disruption = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'disruption',
      name: 'Disruption & Innovation',
      descriptionMarkdown: `We don't follow the market, we create new ones.`,
      priority: 'high',
      colorHex: '#6366F1',
    },
  })

  const speed = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'speed',
      name: 'Speed to Market',
      descriptionMarkdown: `Move fast, ship often, iterate rapidly.`,
      priority: 'high',
      colorHex: '#F59E0B',
    },
  })

  const craft = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'craft',
      name: 'Technical Excellence',
      descriptionMarkdown: `Beautiful code, elegant solutions, craftsmanship.`,
      priority: 'medium',
      colorHex: '#10B981',
    },
  })

  const moonshot = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'moonshot',
      name: '10x Thinking',
      descriptionMarkdown: `Aim for moonshots, not incremental gains.`,
      priority: 'high',
      colorHex: '#8B5CF6',
    },
  })

  // Links
  await prisma.constellationLink.createMany({
    data: [
      { symbolId: lightning.id, pillarId: disruption.id, linkType: 'core', notesMarkdown: 'Lightning disrupts the sky' },
      { symbolId: lightning.id, pillarId: speed.id, linkType: 'core', notesMarkdown: 'Nothing faster than lightning' },
      { symbolId: trickster.id, pillarId: disruption.id, linkType: 'core', notesMarkdown: 'Trickster breaks conventions' },
      { symbolId: mercury.id, pillarId: speed.id, linkType: 'core', notesMarkdown: 'Mercury is the swift messenger' },
      { symbolId: forge.id, pillarId: craft.id, linkType: 'core', notesMarkdown: 'Forge represents craftsmanship' },
      { symbolId: rocket.id, pillarId: moonshot.id, linkType: 'core', notesMarkdown: 'Literal moonshot symbol' },
      { symbolId: rocket.id, pillarId: speed.id, linkType: 'supporting', notesMarkdown: 'Escape velocity' },
    ],
  })

  console.log(`  ✓ Tech startup constellation seeded`)
}

/**
 * Seed Scenario: Wellness Brand
 * A constellation for a holistic health and wellness company
 */
export async function seedWellnessBrand(prisma: PrismaClient) {
  const communityId = 'wellness-brand'
  console.log(`  → Seeding: ${communityId}`)

  await cleanCommunity(prisma, communityId)

  // Symbols
  const lotus = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'lotus',
      name: 'Lotus Flower',
      category: 'object',
      descriptionMarkdown: `Rises from mud to bloom. Symbol of purity, enlightenment, rebirth.`,
      tags: ['purity', 'enlightenment', 'growth'],
      culturalOrigin: 'Eastern',
      symbolicQualities: { purity: true, enlightenment: true, growth: true },
    },
  })

  const tree = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'tree-of-life',
      name: 'Tree of Life',
      category: 'object',
      descriptionMarkdown: `Roots, trunk, branches. Connection between earth and sky. Growth, stability, interconnection.`,
      tags: ['growth', 'connection', 'stability'],
      culturalOrigin: 'Universal',
      symbolicQualities: { growth: true, stability: true, interconnection: true },
    },
  })

  const water = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'water-element',
      name: 'Water',
      category: 'element',
      descriptionMarkdown: `Flow, adaptability, cleansing, life force.`,
      tags: ['flow', 'cleansing', 'adaptability'],
      symbolicQualities: { flow: true, cleansing: true, nourishment: true },
    },
  })

  const healer = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'healer-archetype',
      name: 'The Healer',
      category: 'archetype',
      descriptionMarkdown: `Brings wholeness, restores balance, tends to wounds.`,
      tags: ['healing', 'balance', 'wholeness'],
      symbolicQualities: { healing: true, compassion: true, wisdom: true },
    },
  })

  const butterfly = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'butterfly',
      name: 'Butterfly',
      category: 'animal',
      descriptionMarkdown: `Metamorphosis. From caterpillar to winged beauty. Complete transformation.`,
      tags: ['transformation', 'beauty', 'freedom'],
      symbolicQualities: { transformation: true, beauty: true, freedom: true },
    },
  })

  // Pillars
  const holistic = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'holistic-wellness',
      name: 'Holistic Wellness',
      descriptionMarkdown: `Mind, body, spirit - all interconnected.`,
      priority: 'high',
      colorHex: '#10B981',
    },
  })

  const natural = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'natural-healing',
      name: 'Natural Healing',
      descriptionMarkdown: `Work with nature, not against it.`,
      priority: 'high',
      colorHex: '#059669',
    },
  })

  const journey = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'personal-journey',
      name: 'Personal Journey',
      descriptionMarkdown: `Everyone's path to wellness is unique.`,
      priority: 'medium',
      colorHex: '#8B5CF6',
    },
  })

  const balance = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'balance',
      name: 'Balance & Harmony',
      descriptionMarkdown: `Find your center, restore equilibrium.`,
      priority: 'high',
      colorHex: '#06B6D4',
    },
  })

  // Links
  await prisma.constellationLink.createMany({
    data: [
      { symbolId: lotus.id, pillarId: holistic.id, linkType: 'core', notesMarkdown: 'Lotus embodies complete wellness' },
      { symbolId: lotus.id, pillarId: journey.id, linkType: 'supporting', notesMarkdown: 'Rising from mud is a journey' },
      { symbolId: tree.id, pillarId: holistic.id, linkType: 'core', notesMarkdown: 'Tree connects all aspects of life' },
      { symbolId: water.id, pillarId: natural.id, linkType: 'core', notesMarkdown: 'Water is natural healing element' },
      { symbolId: water.id, pillarId: balance.id, linkType: 'supporting', notesMarkdown: 'Water seeks balance' },
      { symbolId: healer.id, pillarId: natural.id, linkType: 'core', notesMarkdown: 'Healer works with natural forces' },
      { symbolId: butterfly.id, pillarId: journey.id, linkType: 'core', notesMarkdown: 'Metamorphosis is a personal journey' },
    ],
  })

  console.log(`  ✓ Wellness brand constellation seeded`)
}

/**
 * Seed Scenario: Education Platform
 * A constellation for a learning and knowledge platform
 */
export async function seedEducationPlatform(prisma: PrismaClient) {
  const communityId = 'education-platform'
  console.log(`  → Seeding: ${communityId}`)

  await cleanCommunity(prisma, communityId)

  // Symbols
  const athena = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'athena',
      name: 'Athena',
      category: 'myth_figure',
      descriptionMarkdown: `Goddess of wisdom, strategy, and skillful warfare. Patron of learning and crafts.`,
      tags: ['wisdom', 'strategy', 'learning'],
      culturalOrigin: 'Greek',
      symbolicQualities: { wisdom: true, strategy: true, knowledge: true },
    },
  })

  const owl = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'owl',
      name: 'Owl',
      category: 'animal',
      descriptionMarkdown: `Sees in darkness. Symbol of wisdom, knowledge, and insight.`,
      tags: ['wisdom', 'insight', 'knowledge'],
      symbolicQualities: { wisdom: true, perception: true, insight: true },
    },
  })

  const library = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'great-library',
      name: 'The Great Library',
      category: 'object',
      descriptionMarkdown: `Repository of all human knowledge. Alexandria. The collective wisdom of ages.`,
      tags: ['knowledge', 'preservation', 'access'],
      symbolicQualities: { knowledge: true, preservation: true },
    },
  })

  const seed = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'seed',
      name: 'Seed',
      category: 'object',
      descriptionMarkdown: `Potential waiting to grow. Small beginnings that become mighty trees.`,
      tags: ['potential', 'growth', 'beginning'],
      symbolicQualities: { potential: true, growth: true },
    },
  })

  const sage = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'sage-archetype',
      name: 'The Sage',
      category: 'archetype',
      descriptionMarkdown: `Seeker of truth, teacher, guide. Wisdom through understanding.`,
      tags: ['wisdom', 'teaching', 'truth'],
      symbolicQualities: { wisdom: true, teaching: true, understanding: true },
    },
  })

  // Pillars
  const curiosity = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'curiosity',
      name: 'Lifelong Curiosity',
      descriptionMarkdown: `Never stop asking questions, never stop learning.`,
      priority: 'high',
      colorHex: '#F59E0B',
    },
  })

  const accessibility = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'accessibility',
      name: 'Knowledge for All',
      descriptionMarkdown: `Education should be accessible to everyone, everywhere.`,
      priority: 'high',
      colorHex: '#10B981',
    },
  })

  const mastery = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'mastery',
      name: 'Path to Mastery',
      descriptionMarkdown: `Support deep learning and skill development.`,
      priority: 'high',
      colorHex: '#8B5CF6',
    },
  })

  const community_learning = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'community-learning',
      name: 'Learning Together',
      descriptionMarkdown: `We learn best in community, sharing and building knowledge together.`,
      priority: 'medium',
      colorHex: '#06B6D4',
    },
  })

  // Links
  await prisma.constellationLink.createMany({
    data: [
      { symbolId: athena.id, pillarId: mastery.id, linkType: 'core', notesMarkdown: 'Athena represents mastery of skill' },
      { symbolId: owl.id, pillarId: curiosity.id, linkType: 'core', notesMarkdown: 'Owl seeks truth in darkness' },
      { symbolId: library.id, pillarId: accessibility.id, linkType: 'core', notesMarkdown: 'Library makes knowledge accessible' },
      { symbolId: seed.id, pillarId: mastery.id, linkType: 'supporting', notesMarkdown: 'Every master starts as a seed' },
      { symbolId: sage.id, pillarId: mastery.id, linkType: 'core', notesMarkdown: 'Sage embodies deep mastery' },
      { symbolId: sage.id, pillarId: community_learning.id, linkType: 'supporting', notesMarkdown: 'Sage shares wisdom' },
    ],
  })

  console.log(`  ✓ Education platform constellation seeded`)
}

/**
 * Seed Scenario: Social Movement
 * A constellation for a justice-focused social movement
 */
export async function seedSocialMovement(prisma: PrismaClient) {
  const communityId = 'social-movement'
  console.log(`  → Seeding: ${communityId}`)

  await cleanCommunity(prisma, communityId)

  // Symbols
  const chains_breaking = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'breaking-chains',
      name: 'Breaking Chains',
      category: 'object',
      descriptionMarkdown: `Liberation from bondage. Freedom from oppression. The moment of breakthrough.`,
      tags: ['liberation', 'freedom', 'breakthrough'],
      symbolicQualities: { liberation: true, strength: true, breakthrough: true },
    },
  })

  const torch = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'torch',
      name: 'The Torch',
      category: 'object',
      descriptionMarkdown: `Passed from generation to generation. Light in darkness. Olympic flame, Statue of Liberty.`,
      tags: ['enlightenment', 'continuity', 'hope'],
      symbolicQualities: { enlightenment: true, hope: true, legacy: true },
    },
  })

  const circle = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'circle',
      name: 'The Circle',
      category: 'object',
      descriptionMarkdown: `Unity, equality, wholeness. No beginning, no end. King Arthur's Round Table.`,
      tags: ['unity', 'equality', 'inclusion'],
      symbolicQualities: { unity: true, equality: true, wholeness: true },
    },
  })

  const warrior = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'warrior-archetype',
      name: 'The Warrior',
      category: 'archetype',
      descriptionMarkdown: `Stands for what's right. Protects the vulnerable. Fights for justice.`,
      tags: ['courage', 'protection', 'justice'],
      symbolicQualities: { courage: true, protection: true, determination: true },
    },
  })

  const river = await prisma.mythicSymbol.create({
    data: {
      communityId,
      key: 'river',
      name: 'River',
      category: 'element',
      descriptionMarkdown: `Unstoppable flow. Carves through mountains over time. Collective force.`,
      tags: ['persistence', 'collective-power', 'change'],
      symbolicQualities: { persistence: true, power: true, flow: true },
    },
  })

  // Pillars
  const justice = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'justice',
      name: 'Justice & Equity',
      descriptionMarkdown: `Fighting for a fair and just world for all.`,
      priority: 'high',
      colorHex: '#DC2626',
    },
  })

  const collective_power = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'collective-power',
      name: 'Collective Power',
      descriptionMarkdown: `Together we are unstoppable. Power of the people.`,
      priority: 'high',
      colorHex: '#7C3AED',
    },
  })

  const liberation = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'liberation',
      name: 'Liberation',
      descriptionMarkdown: `Free all people from systems of oppression.`,
      priority: 'high',
      colorHex: '#059669',
    },
  })

  const legacy = await prisma.brandPillar.create({
    data: {
      communityId,
      key: 'legacy',
      name: 'Generational Legacy',
      descriptionMarkdown: `Build a better world for those who come after us.`,
      priority: 'medium',
      colorHex: '#F59E0B',
    },
  })

  // Links
  await prisma.constellationLink.createMany({
    data: [
      { symbolId: chains_breaking.id, pillarId: liberation.id, linkType: 'core', notesMarkdown: 'Breaking chains is literal liberation' },
      { symbolId: torch.id, pillarId: legacy.id, linkType: 'core', notesMarkdown: 'Torch passed to next generation' },
      { symbolId: circle.id, pillarId: justice.id, linkType: 'core', notesMarkdown: 'Circle represents equality and justice' },
      { symbolId: warrior.id, pillarId: justice.id, linkType: 'core', notesMarkdown: 'Warrior fights for justice' },
      { symbolId: river.id, pillarId: collective_power.id, linkType: 'core', notesMarkdown: 'River is collective unstoppable force' },
    ],
  })

  console.log(`  ✓ Social movement constellation seeded`)
}

/**
 * Helper: Clean community data
 */
async function cleanCommunity(prisma: PrismaClient, communityId: string) {
  await prisma.activityLog.deleteMany({ where: { communityId } })
  await prisma.contentPiecePillar.deleteMany({
    where: { contentPiece: { communityId } },
  })
  await prisma.contentPieceSymbol.deleteMany({
    where: { contentPiece: { communityId } },
  })
  await prisma.contentPiece.deleteMany({ where: { communityId } })
  await prisma.themePillar.deleteMany({ where: { theme: { communityId } } })
  await prisma.themeSymbol.deleteMany({ where: { theme: { communityId } } })
  await prisma.constellationTheme.deleteMany({ where: { communityId } })
  await prisma.symbolRelationship.deleteMany({
    where: { fromSymbol: { communityId } },
  })
  await prisma.constellationLink.deleteMany({
    where: { symbol: { communityId } },
  })
  await prisma.mythicSymbol.deleteMany({ where: { communityId } })
  await prisma.brandPillar.deleteMany({ where: { communityId } })
}
