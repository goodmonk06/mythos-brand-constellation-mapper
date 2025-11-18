#!/usr/bin/env tsx

/**
 * Constellation CLI
 *
 * Command-line tool for constellation operations and maintenance.
 *
 * Usage:
 *   npm run cli -- <command> [options]
 *   tsx src/cli/index.ts <command> [options]
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import { seedDemo, seedTechStartup, seedWellnessBrand, seedEducationPlatform, seedSocialMovement } from './seed-scenarios'

const prisma = new PrismaClient()

const commands = {
  seed: {
    description: 'Seed database with scenario data',
    usage: 'seed [scenario]',
    scenarios: ['demo', 'tech-startup', 'wellness', 'education', 'social-movement', 'all'],
    async execute(scenario: string = 'demo') {
      console.log(`🌱 Seeding scenario: ${scenario}`)

      switch (scenario) {
        case 'demo':
          await seedDemo(prisma)
          break
        case 'tech-startup':
          await seedTechStartup(prisma)
          break
        case 'wellness':
          await seedWellnessBrand(prisma)
          break
        case 'education':
          await seedEducationPlatform(prisma)
          break
        case 'social-movement':
          await seedSocialMovement(prisma)
          break
        case 'all':
          await seedDemo(prisma)
          await seedTechStartup(prisma)
          await seedWellnessBrand(prisma)
          await seedEducationPlatform(prisma)
          await seedSocialMovement(prisma)
          break
        default:
          console.error(`Unknown scenario: ${scenario}`)
          console.log(`Available scenarios: ${commands.seed.scenarios.join(', ')}`)
          process.exit(1)
      }

      console.log('✅ Seeding complete')
    },
  },

  export: {
    description: 'Export constellation as JSON',
    usage: 'export <communityId> [output-file]',
    async execute(communityId: string, outputFile?: string) {
      if (!communityId) {
        console.error('Error: communityId is required')
        console.log(`Usage: ${commands.export.usage}`)
        process.exit(1)
      }

      console.log(`📤 Exporting constellation for community: ${communityId}`)

      const [symbols, pillars, links, relationships, themes, content] = await Promise.all([
        prisma.mythicSymbol.findMany({ where: { communityId } }),
        prisma.brandPillar.findMany({ where: { communityId } }),
        prisma.constellationLink.findMany({
          where: { symbol: { communityId } },
          include: { symbol: true, pillar: true },
        }),
        prisma.symbolRelationship.findMany({
          where: { fromSymbol: { communityId } },
          include: { fromSymbol: true, toSymbol: true },
        }),
        prisma.constellationTheme.findMany({
          where: { communityId },
          include: {
            symbols: { include: { symbol: true } },
            pillars: { include: { pillar: true } },
          },
        }),
        prisma.contentPiece.findMany({ where: { communityId } }),
      ])

      const constellation = {
        communityId,
        exportedAt: new Date().toISOString(),
        symbols,
        pillars,
        links,
        relationships,
        themes,
        content,
      }

      const json = JSON.stringify(constellation, null, 2)

      if (outputFile) {
        await fs.writeFile(outputFile, json)
        console.log(`✅ Exported to ${outputFile}`)
      } else {
        console.log(json)
      }
    },
  },

  stats: {
    description: 'Show constellation statistics',
    usage: 'stats <communityId>',
    async execute(communityId: string) {
      if (!communityId) {
        console.error('Error: communityId is required')
        console.log(`Usage: ${commands.stats.usage}`)
        process.exit(1)
      }

      console.log(`📊 Constellation Statistics for: ${communityId}\n`)

      const [
        symbolCount,
        pillarCount,
        linkCount,
        relationshipCount,
        themeCount,
        contentCount,
      ] = await Promise.all([
        prisma.mythicSymbol.count({ where: { communityId } }),
        prisma.brandPillar.count({ where: { communityId } }),
        prisma.constellationLink.count({ where: { symbol: { communityId } } }),
        prisma.symbolRelationship.count({ where: { fromSymbol: { communityId } } }),
        prisma.constellationTheme.count({ where: { communityId } }),
        prisma.contentPiece.count({ where: { communityId } }),
      ])

      // Category breakdown
      const symbolsByCategory = await prisma.mythicSymbol.groupBy({
        by: ['category'],
        where: { communityId },
        _count: true,
      })

      const linksByType = await prisma.constellationLink.groupBy({
        by: ['linkType'],
        where: { symbol: { communityId } },
        _count: true,
      })

      const contentByType = await prisma.contentPiece.groupBy({
        by: ['contentType'],
        where: { communityId },
        _count: true,
      })

      console.log('Core Entities:')
      console.log(`  Mythic Symbols:        ${symbolCount}`)
      console.log(`  Brand Pillars:         ${pillarCount}`)
      console.log(`  Constellation Links:   ${linkCount}`)
      console.log(`  Symbol Relationships:  ${relationshipCount}`)
      console.log(`  Themes:                ${themeCount}`)
      console.log(`  Content Pieces:        ${contentCount}`)

      console.log('\nSymbols by Category:')
      symbolsByCategory.forEach(({ category, _count }) => {
        console.log(`  ${category.padEnd(15)} ${_count}`)
      })

      console.log('\nLinks by Type:')
      linksByType.forEach(({ linkType, _count }) => {
        console.log(`  ${linkType.padEnd(15)} ${_count}`)
      })

      if (contentByType.length > 0) {
        console.log('\nContent by Type:')
        contentByType.forEach(({ contentType, _count }) => {
          console.log(`  ${contentType.padEnd(15)} ${_count}`)
        })
      }
    },
  },

  validate: {
    description: 'Validate data integrity',
    usage: 'validate [communityId]',
    async execute(communityId?: string) {
      console.log('🔍 Validating data integrity...\n')

      let issues = 0

      // Check for orphaned links
      const orphanedLinks = await prisma.constellationLink.findMany({
        where: communityId ? { symbol: { communityId } } : {},
        include: { symbol: true, pillar: true },
      })

      const invalidLinks = orphanedLinks.filter(
        (link) => !link.symbol || !link.pillar
      )

      if (invalidLinks.length > 0) {
        console.log(`❌ Found ${invalidLinks.length} orphaned constellation links`)
        issues += invalidLinks.length
      }

      // Check for orphaned relationships
      const orphanedRels = await prisma.symbolRelationship.findMany({
        where: communityId ? { fromSymbol: { communityId } } : {},
        include: { fromSymbol: true, toSymbol: true },
      })

      const invalidRels = orphanedRels.filter(
        (rel) => !rel.fromSymbol || !rel.toSymbol
      )

      if (invalidRels.length > 0) {
        console.log(`❌ Found ${invalidRels.length} orphaned symbol relationships`)
        issues += invalidRels.length
      }

      // Check for duplicate keys
      const symbols = await prisma.mythicSymbol.findMany({
        where: communityId ? { communityId } : {},
      })

      const symbolKeys = new Map<string, string[]>()
      symbols.forEach((s) => {
        const key = `${s.communityId}:${s.key}`
        if (!symbolKeys.has(key)) {
          symbolKeys.set(key, [])
        }
        symbolKeys.get(key)!.push(s.id)
      })

      const duplicateSymbolKeys = Array.from(symbolKeys.entries()).filter(
        ([_, ids]) => ids.length > 1
      )

      if (duplicateSymbolKeys.length > 0) {
        console.log(`❌ Found ${duplicateSymbolKeys.length} duplicate symbol keys`)
        issues += duplicateSymbolKeys.length
      }

      if (issues === 0) {
        console.log('✅ Data integrity check passed. No issues found.')
      } else {
        console.log(`\n⚠️  Found ${issues} total issues`)
      }
    },
  },

  clean: {
    description: 'Clean up test/demo data',
    usage: 'clean <communityId>',
    async execute(communityId: string) {
      if (!communityId) {
        console.error('Error: communityId is required')
        console.log(`Usage: ${commands.clean.usage}`)
        process.exit(1)
      }

      console.log(`🗑️  Cleaning data for community: ${communityId}`)

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

      console.log('✅ Cleanup complete')
    },
  },

  help: {
    description: 'Show help information',
    usage: 'help [command]',
    async execute(command?: string) {
      if (command && commands[command as keyof typeof commands]) {
        const cmd = commands[command as keyof typeof commands]
        console.log(`\n${command}: ${cmd.description}`)
        console.log(`Usage: ${cmd.usage}\n`)
      } else {
        console.log('\n🌌 Constellation CLI\n')
        console.log('Available commands:\n')
        Object.entries(commands).forEach(([name, cmd]) => {
          console.log(`  ${name.padEnd(12)} ${cmd.description}`)
        })
        console.log('\nUse "help <command>" for more information\n')
      }
    },
  },
}

// Parse command line arguments
async function main() {
  const [command, ...args] = process.argv.slice(2)

  if (!command || command === 'help') {
    await commands.help.execute(args[0])
    process.exit(0)
  }

  if (commands[command as keyof typeof commands]) {
    try {
      await commands[command as keyof typeof commands].execute(...args)
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error)
      process.exit(1)
    } finally {
      await prisma.$disconnect()
    }
  } else {
    console.error(`Unknown command: ${command}`)
    console.log('Use "help" to see available commands')
    process.exit(1)
  }
}

// Run CLI
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
